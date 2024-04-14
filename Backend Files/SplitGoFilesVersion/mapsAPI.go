package main

import (
	"context"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"googlemaps.github.io/maps"
	// gin-swagger middleware
	// swagger embed files
)

var key string = "AIzaSyCOWMp-1VBRK8mEJBDxXtG_TNyih9oTIEg"

// @Summary Convert street name to coordinates
// @Description Convert street name to latitude and longitude
// @Tags Maps API
// @Accept json
// @Produce json
// @Param streetName query string true "Street name"
// @Success 200 {array} float64 "Latitude and Longitude"
// @Failure 500 {object} string "Internal Server Error"
// @Router /maps/sntocoords [get]
func handleStreetNameToCoordinates(c *gin.Context) {
	streetName := c.Query("streetName")
	results, err := streetNameToCoordinates(streetName)
	if err != nil {
		// Log the error for internal tracking
		log.Printf("Error in handleStreetNameToCoordinates for streetName %s: %v", streetName, err)

		// Respond with an Internal Server Error status and a generic error message
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal Server Error",
		})
		return
	}

	c.JSON(http.StatusOK, results)
}

// @Summary Convert coordinates to street name
// @Description Convert latitude and longitude to street name
// @Tags Maps API
// @Produce json
// @Param lat query string true "Latitude"
// @Param long query string true "Longitude"
// @Success 200 {string} string "Street name"
// @Router /maps/coordstosn [get]
func handleCoordinateToStreetName(c *gin.Context) {
	lat, _ := c.GetQuery("lat")
	long, _ := c.GetQuery("long")

	// Convert query params to float64
	latitude, err := strconv.ParseFloat(lat, 64)
	longitude, err := strconv.ParseFloat(long, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid latitude or longitude"})
		return
	}

	results := coordinateToStreetName(latitude, longitude)
	c.JSON(http.StatusOK, results)
}

func streetNameToCoordinates(streetName string) ([2]float64, error) {
	c, err := maps.NewClient(maps.WithAPIKey(key))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	req := &maps.PlaceAutocompleteRequest{
		Input: streetName,
		Components: map[maps.Component][]string{
			maps.ComponentCountry: {"sg"},
		},
	}

	res, err := c.PlaceAutocomplete(context.Background(), req)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	req2 := &maps.GeocodingRequest{
		Address: res.Predictions[0].Description,
	}

	res2, err := c.Geocode(context.Background(), req2)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	var result [2]float64
	result[0] = res2[0].Geometry.Location.Lat
	result[1] = res2[0].Geometry.Location.Lng
	return result, err
}

func coordinateToStreetName(lat float64, long float64) string {
	c, err := maps.NewClient(maps.WithAPIKey(key))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	req := &maps.GeocodingRequest{
		LatLng: &maps.LatLng{Lat: lat, Lng: long},
	}

	res, err := c.Geocode(context.Background(), req)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	return res[0].FormattedAddress
}
