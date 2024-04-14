package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/paulmach/orb"
	"github.com/paulmach/orb/geojson"
)

// swaggerignore
type Coordinate struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// @Summary Get taxi coordinates within 5km of a given coordinate
// @Description Retrieve taxi coordinates from an external API and return only those within 5km of the specified coordinate as JSON.
// @Tags Taxi API
// @Produce json
// @Param latitude query number true "Latitude of the reference point"
// @Param longitude query number true "Longitude of the reference point"
// @Success 200 {array} Coordinate "OK"
// @Router /taxi [get]
func handleTaxiCoordinates(c *gin.Context) {
	base := "https://api.data.gov.sg/v1/"
	endPoint := "/transport/taxi-availability"
	dateTime := time.Now().Format("2006-01-02T15:04:05")
	fullURL := fmt.Sprintf("%s%s?date_time=%s", base, endPoint, dateTime)

	// Extracting the coordinate from the request URL parameters
	latitudeStr := c.Query("latitude")
	longitudeStr := c.Query("longitude")

	// Converting latitude and longitude into float64
	latitude, err := strconv.ParseFloat(latitudeStr, 64)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid latitude")
		return
	}

	longitude, err := strconv.ParseFloat(longitudeStr, 64)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid longitude")
		return
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	response, err := client.Get(fullURL)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error fetching data from API")
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		c.String(http.StatusInternalServerError, "Unexpected response status from API")
		return
	}

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error reading response body")
		return
	}

	geoJSONObj, err := geojson.UnmarshalFeatureCollection(responseBody)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error parsing GeoJSON")
		return
	}

	// Get coordinates from GeoJSON
	var coordinates []Coordinate
	for _, feature := range geoJSONObj.Features {
		for _, point := range feature.Geometry.(orb.MultiPoint) {
			coordinate := Coordinate{
				Latitude:  point[1],
				Longitude: point[0],
			}
			coordinates = append(coordinates, coordinate)
		}
	}

	// From all coordinates, filter coordinates within 5km of the given coordinate in the GET request
	var filteredCoordinates []Coordinate
	for _, coord := range coordinates {
		// Calculate distance between coord and the given coordinate
		distance := haversine(latitude, longitude, coord.Latitude, coord.Longitude)

		// Check if distance is less than 5km (5000 meters)
		if distance < 5.0 {
			filteredCoordinates = append(filteredCoordinates, coord)
		}
	}

	// Convert filtered coordinates to JSON
	filteredCoordinatesJSON, err := json.Marshal(filteredCoordinates)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error converting coordinates to JSON")
		return
	}

	// Return JSON response
	c.Data(http.StatusOK, "application/json", filteredCoordinatesJSON)
}

func getNearbyTaxiLocations(lat float64, lon float64) []Coordinate {
	// Construct the API URL
	base := "https://api.data.gov.sg/v1/"
	endPoint := "/transport/taxi-availability"
	dateTime := time.Now().Format("2006-01-02T15:04:05")
	fullURL := fmt.Sprintf("%s%s?date_time=%s", base, endPoint, dateTime)

	// Make an HTTP GET request
	resp, err := http.Get(fullURL)
	if err != nil {
		fmt.Println("Error making API request:", err)
	}
	defer resp.Body.Close()

	responseBody, err := ioutil.ReadAll(resp.Body)

	geoJSONObj, err := geojson.UnmarshalFeatureCollection(responseBody)

	// Get coordinates from GeoJSON
	var coordinates []Coordinate
	for _, feature := range geoJSONObj.Features {
		for _, point := range feature.Geometry.(orb.MultiPoint) {
			coordinate := Coordinate{
				Latitude:  point[1],
				Longitude: point[0],
			}
			coordinates = append(coordinates, coordinate)
		}
	}

	var filteredCoordinates []Coordinate
	for _, coord := range coordinates {
		// Calculate distance between coord and the given coordinate
		distance := haversine(lat, lon, coord.Latitude, coord.Longitude)

		// Check if distance is less than 5km (5000 meters)
		if distance < 5.0 {
			filteredCoordinates = append(filteredCoordinates, coord)
		}
	}

	return filteredCoordinates
}

// Haversine formula is used to calculate distance between two points on Earth given their latitudes and longitudes
func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	// Radius of the Earth in kilometers
	const R = 6371

	// Convert latitude and longitude from degrees to radians
	lat1Rad := lat1 * math.Pi / 180
	lon1Rad := lon1 * math.Pi / 180
	lat2Rad := lat2 * math.Pi / 180
	lon2Rad := lon2 * math.Pi / 180

	// Calculate differences
	dLat := lat2Rad - lat1Rad
	dLon := lon2Rad - lon1Rad

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(dLon/2)*math.Sin(dLon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	// Distance in kilometers
	distance := R * c
	return distance
}

//Old content when returning HTML
/*
htmlContent := generateHTML(geoJSONObj)
	c.Header("Content-Type", "text/html")
	c.String(http.StatusOK, htmlContent)


func generateHTML(geoJSONObj *geojson.FeatureCollection) string {
	var htmlContent string

	htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Leaflet Map</title>
	<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
	<style>
		#map { height: 600px; }
	</style>
</head>
<body>
	<div id="map"></div>
	<script>
		var map = L.map('map').setView([1.3521, 103.8198], 12);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
		}).addTo(map);

`

	for _, feature := range geoJSONObj.Features {
		for _, coord := range feature.Geometry.(orb.MultiPoint) {
			htmlContent += fmt.Sprintf("L.marker([%f, %f]).addTo(map);\n", coord[1], coord[0])
		}
	}

	htmlContent += `
	</script>
</body>
</html>
`

	return htmlContent
}
*/
