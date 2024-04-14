// Recommedation model:
// - Randomly generate 500 coordinates around the user's set location (within radius of 0.1km to 0.5km)
// - For each of this 500 coordinates, google RoutesAPI will find the optimal route to get to destination. So for each route, the function return coordianates of nearby road and duration (takes into account traffic condition) to reach destination.
// - Sort based on duration to get top 10 coordinates based on duration.
// - This 10 coordinates will be the recommended location.

package main

import (
	"context"
	"crypto/tls"
	"log"
	"math"
	"math/rand"
	"net/http"
	"sort"
	"strconv"
	"time"

	routespb "cloud.google.com/go/maps/routing/apiv2/routingpb"
	"github.com/gin-gonic/gin"
	"google.golang.org/genproto/googleapis/type/latlng"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/metadata"
)

const (
	//Apple Orchard (1.3030989281888614, 103.83618821584294)
	//NTU (1.3470532727794897, 103.68081096626513)
	//somerset (1.3011528125217717, 103.83861709287221)
	fieldMask  = "*"
	apiKey     = "AIzaSyCOWMp-1VBRK8mEJBDxXtG_TNyih9oTIEg"
	serverAddr = "routes.googleapis.com:443"
)

// TODO: to be removed once destination feature in app is added
var centralised_destination [2]float64 = [2]float64{1.3745275028921855, 103.80364124955555}

type Location struct {
	Lat               float64 `json:"lat"`
	Lng               float64 `json:"lng"`
	EstimatedDuration float64 `json:"estimatedDuration"`
}

// getRecommendedLocationsHandler godoc
// @Summary Get Recommended Locations
// @Description Retrieves a list of recommended locations based on user's current position and other parameters.
// @Tags Recommendation API
// @Accept json
// @Produce json
// @Param lat query float64 true "Latitude of the user's current position"
// @Param lon query float64 true "Longitude of the user's current position"
// @Param numOfRandomCoordinates query int false "Number of random coordinates to generate around the user's position"
// @Param maxNumOfResults query int false "Maximum number of recommended locations to return (at least 1 will be returned)"
// @Success 200 {array} array "A list of recommended locations with latitude, longitude, and estimated travel duration in seconds"
// @Failure 400 {object} string "Bad Request"
// @Failure 500 {object} string "Internal Server Error"
// @Router /recommendations [get]
func getRecommendedLocationsHandler(c *gin.Context) {
	latStr := c.Query("lat")
	lonStr := c.Query("lon")
	numOfCoordinatesStr := c.Query("numOfRandomCoordinates")
	numOfResultsStr := c.Query("maxNumOfResults")

	// Convert latitude and longitude from string to float64
	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid latitude value"})
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid longitude value"})
		return
	}

	// Convert numOfCoordinates and numOfResults from string to int
	numOfCoordinates, err := strconv.Atoi(numOfCoordinatesStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid numOfCoordinates value"})
		return
	}

	numOfResults, err := strconv.Atoi(numOfResultsStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid numOfResults value"})
		return
	}

	// Assuming getRecommendedLocations is modified to accept numeric parameters correctly
	coordinates := getRecommendedLocations(lat, lon, numOfCoordinates, numOfResults)
	c.JSON(http.StatusOK, coordinates)
}

func nearby_coordinates(lat float64, lon float64) []float64 {
	PI := math.Pi
	// Earth's radius in kilometers
	var R float64 = 6371
	// Maximum distance to move in kilometers
	maxDistance := 0.2
	// Minimum distance to move in kilometers
	minDistance := 0.1
	// Random distance within the range
	distance := rand.Float64()*(maxDistance-minDistance) + minDistance
	//Bearing (degrees)
	bearing := rand.Float64() * 360

	// Convert latitude and longitude to radians
	lat1 := lat * (PI / 180)
	lon1 := lon * (PI / 180)

	//Calculate new latitude and longitude
	delta_lat := math.Asin(math.Sin(lat1)*math.Cos(distance/R) + math.Cos(lat1)*math.Sin(distance/R)*math.Cos(bearing))
	delta_lon := lon1 + math.Atan2(math.Sin(bearing)*math.Sin(distance/R)*math.Cos(lat1), math.Cos(distance/R)-math.Sin(lat1)*math.Sin(delta_lat))

	// Convert back to degrees
	lat2 := delta_lat * (180 / PI)
	lon2 := delta_lon * (180 / PI)

	result := []float64{lat2, lon2}

	return result
}

func getRecommendedLocations(lat float64, lon float64, numOfRandomCoordinates int, maxNumOfResults int) [][]float64 {
	var locations [][]float64
	var optimalResults [][]float64
	taxiLocations := getNearbyTaxiLocations(lat, lon)

	if numOfRandomCoordinates <= 0 {
		return optimalResults
	}

	if maxNumOfResults <= 0 {
		return optimalResults
	}

	for i := 0; i < numOfRandomCoordinates; i++ {
		//randomly generate coordinates nearby user location within 0.1 km to 0.5km
		sum := 0.0
		nearby := nearby_coordinates(lat, lon)
		//compute the total distance from all other taxi
		for j := 0; j < len(taxiLocations); j++ {
			sum = sum + haversine(nearby[0], nearby[1], taxiLocations[j].Latitude, taxiLocations[j].Longitude)
		}
		//fmt.Print(sum)
		locations = append(locations, append(nearby, sum))
	}

	//sort by sum of distance from random coordinates to all other taxis in 5km radius
	sort.SliceStable(locations, func(i, j int) bool {
		return locations[i][2] < locations[j][2]
	})

	//get the coordinates of sum of distance with taxis, then get their nearby roads as pickup point
	var results [][]float64
	for i := 0; i < min(numOfRandomCoordinates, 25); i++ {
		pickupPoint := optimalPickUpPoint(locations[i][0], locations[i][1])
		results = append(results, append(pickupPoint))
	}

	//sort to get the top coordinates nearest to destination
	sort.SliceStable(results, func(i, j int) bool {
		return results[i][2] < results[j][2]
	})

	// remove coordinates that are very close together
	optimalResults = append(optimalResults, results[0])
	for i := 1; i < len(results); i++ {
		if haversine(results[i-1][0], results[i-1][1], results[i][0], results[i][1]) > 0.1 {
			optimalResults = append(optimalResults, results[i])
		}
		if len(optimalResults) == 5 {
			break
		}
	}

	maxNumOfResults = min(maxNumOfResults, len(optimalResults))
	return optimalResults[:maxNumOfResults]
}

func optimalPickUpPoint(lat float64, lon float64) []float64 {
	config := tls.Config{}
	conn, err := grpc.Dial(serverAddr,
		grpc.WithTransportCredentials(credentials.NewTLS(&config)))
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()
	client := routespb.NewRoutesClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	ctx = metadata.AppendToOutgoingContext(ctx, "X-Goog-Api-Key", apiKey)
	ctx = metadata.AppendToOutgoingContext(ctx, "X-Goog-Fieldmask", fieldMask)
	defer cancel()

	req := &routespb.ComputeRoutesRequest{
		Origin: &routespb.Waypoint{
			LocationType: &routespb.Waypoint_Location{
				Location: &routespb.Location{
					LatLng: &latlng.LatLng{
						Latitude:  lat,
						Longitude: lon,
					},
				},
			},
		},
		Destination: &routespb.Waypoint{
			LocationType: &routespb.Waypoint_Location{
				Location: &routespb.Location{
					LatLng: &latlng.LatLng{
						Latitude:  centralised_destination[0],
						Longitude: centralised_destination[1],
					},
				},
			},
		},
		TravelMode:        routespb.RouteTravelMode_DRIVE,
		RoutingPreference: routespb.RoutingPreference_TRAFFIC_AWARE_OPTIMAL,
	}

	// execute rpc
	resp, err := client.ComputeRoutes(ctx, req)

	if err != nil {
		// "rpc error: code = InvalidArgument desc = Request contains an invalid
		// argument" may indicate that your project lacks access to Routes
		log.Fatal(err)
	}

	var result []float64 = []float64{float64(resp.Routes[0].Legs[0].StartLocation.LatLng.Latitude), float64(resp.Routes[0].Legs[0].StartLocation.LatLng.Longitude), float64(resp.Routes[0].Duration.Seconds)}

	return result
}
