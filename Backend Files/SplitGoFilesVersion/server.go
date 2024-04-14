package main

import (
	"log"

	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files" // gin-swagger middleware
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "main/docs"
)

// @title Backend APIs
// @version 1.0
// @description APIs for frontend use.
// @BasePath /
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
		mapsGroup.GET("sntocoords", handleStreetNameToCoordinates)
		mapsGroup.GET("coordstosn", handleCoordinateToStreetName)
	}

	r.GET("/taxi", handleTaxiCoordinates)
	r.GET("/recommendations", getRecommendedLocationsHandler)

	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start the HTTP server using Gin
	log.Fatal(r.Run("0.0.0.0:80"))
}
