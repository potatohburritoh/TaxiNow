package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/paulmach/orb"
	"github.com/paulmach/orb/geojson"
	"googlemaps.github.io/maps"

	swaggerFiles "github.com/swaggo/files" // gin-swagger middleware
	ginSwagger "github.com/swaggo/gin-swagger"

	// swagger embed files
	_ "Backend/docs"
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

	//MapsAPIHandler Variables
	key string = "AIzaSyCOWMp-1VBRK8mEJBDxXtG_TNyih9oTIEg"
)

// @title Your API's Title
// @version 1.0
// @description This is a sample server for the API.
// @BasePath /api/v1
func main() {
	// Initialize Gin router
	r := gin.Default()

	// Define routes
	locationGroup := r.Group("/location")
	{
		locationGroup.Handle("GET", "/", handleLocation)
		locationGroup.Handle("PUT", "/", handleLocation)
	}

	mapsGroup := r.Group("/maps")
	{
		mapsGroup.GET("/sntocoords", handleStreetNameToCoordinates)
		mapsGroup.GET("/coordstosn", handleCoordinateToStreetName)
	}

	r.GET("/taxi", handleTaxiCoordinates)

	// Swagger routes
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start the HTTP server using Gin
	log.Fatal(r.Run(":8080"))
}

// @Summary Handle Location requests
// @Description Route requests based on HTTP method for updating and retrieving location
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

// @Summary Convert street name to coordinates
// @Description Convert street name to latitude and longitude
// @Accept json
// @Produce json
// @Param streetName query string true "Street name"
// @Success 200 {array} float64 "Latitude and Longitude"
// @Router /streetNameToCoordinates [get]
func handleStreetNameToCoordinates(c *gin.Context) {
	streetName := c.Query("streetName")
	results := streetNameToCoordinates(streetName)
	c.JSON(http.StatusOK, results)
}

// @Summary Convert coordinates to street name
// @Description Convert latitude and longitude to street name
// @Produce json
// @Param lat query string true "Latitude"
// @Param long query string true "Longitude"
// @Success 200 {string} string "Street name"
// @Router /coordinatesToStreetName [get]
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

// @Summary Get taxi coordinates
// @Description Retrieve taxi coordinates from an external API
// @Produce html
// @Success 200 {string} string "HTML containing taxi coordinates"
// @Router /taxiCoordinates [get]
func handleTaxiCoordinates(c *gin.Context) {
	base := "https://api.data.gov.sg/v1/"
	endPoint := "/transport/taxi-availability"
	dateTime := time.Now().Format("2006-01-02T15:04:05")
	fullURL := fmt.Sprintf("%s%s?date_time=%s", base, endPoint, dateTime)

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

	htmlContent := generateHTML(geoJSONObj)
	c.Header("Content-Type", "text/html")
	c.String(http.StatusOK, htmlContent)
}

func streetNameToCoordinates(streetName string) [2]float64 {
	c, err := maps.NewClient(maps.WithAPIKey(key))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	req := &maps.GeocodingRequest{
		Address: streetName,
	}

	res, err := c.Geocode(context.Background(), req)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	var result [2]float64
	result[0] = res[0].Geometry.Location.Lat
	result[1] = res[0].Geometry.Location.Lng
	return result
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
