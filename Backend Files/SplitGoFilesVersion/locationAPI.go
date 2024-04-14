package main

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	// gin-swagger middleware
	// swagger embed files
)

var (
	//SetLocation Variables
	mu sync.Mutex

	latestLat string
	latestLng string

	defaultLat = 1.3470532727794897
	defaultLng = 103.68081096626513

	// Create a list to store the last 5 locations
	locations [5]string
	index     int
)

// @Summary Handle Location requests
// @Description Route requests based on HTTP method for updating and retrieving location
// @Tags Location API
// @Router /location [get]
// @Router /location [put]
func handleLocation(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		handleGetLocation(c)
	case "PUT":
		handleUpdateLocation(c)
	default:
		c.String(http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// @Summary Update location
// @Description Update location with latitude and longitude
// @Tags Location API
// @Accept json
// @Produce json
// @Param lat query string true "Latitude"
// @Param lng query string true "Longitude"
// @Success 200 {string} string "Latitude and Longitude updated successfully"
// @Router /location [put]
func handleUpdateLocation(c *gin.Context) {
	lat := c.Query("lat")
	lng := c.Query("lng")

	if lat == "" || lng == "" {
		lat = fmt.Sprintf("%f", defaultLat)
		lng = fmt.Sprintf("%f", defaultLng)
	}

	mu.Lock()
	latestLat = lat
	latestLng = lng

	// Store the latest location in the list and update the index
	locations[index] = fmt.Sprintf("Latitude: %s, Longitude: %s", lat, lng)
	index = (index + 1) % 5
	mu.Unlock()

	c.String(http.StatusOK, "Latitude: %s, Longitude: %s", lat, lng)
}

// @Summary Get latest location
// @Description Retrieve the latest stored location
// @Tags Location API
// @Produce plain
// @Success 200 {string} string "Latest location details"
// @Router /location [get]
func handleGetLocation(c *gin.Context) {
	mu.Lock()
	// Get the latest location
	var latestLocation string
	if index == 0 {
		latestLocation = locations[4]
	} else {
		latestLocation = locations[index-1]
	}
	mu.Unlock()

	c.String(http.StatusOK, latestLocation)
}
