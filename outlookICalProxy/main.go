package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/KevinZonda/GoX/pkg/panicx"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func URL(id, token, calendar, ics string) string {

	return strings.Join([]string{
		"https://outlook.office365.com/owa/calendar",
		id,
		token,
		calendar,
		ics,
	}, "/")
}
func main() {
	if !Config.Debug {
		gin.SetMode(gin.ReleaseMode)
	}
	engine := gin.Default()

	engine.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
	}))

	engine.GET("/", func(c *gin.Context) {
		c.String(200, "KevinZonda Outlook iCalendar Proxy Service (OCPxS)")
	})

	engine.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	reachcalendar := proxyGen("reachcalendar.ics")
	calendar := proxyGen("calendar.ics")

	engine.GET("/calendar/:id/:token/:calendar/reachcalendar.ics", reachcalendar)
	engine.GET("/calendar/:id/:token/:calendar/calendar.ics", calendar)
	engine.GET("/calendar/:id/:token/:calendar", calendar)
	engine.GET("/owa/calendar/:id/:token/:calendar/reachcalendar.ics", reachcalendar)
	engine.GET("/owa/calendar/:id/:token/:calendar/calendar.ics", calendar)
	engine.GET("/owa/calendar/:id/:token/:calendar", calendar)
	err := engine.Run(Config.ListenAddr)
	panicx.NotNilErr(err)
}

func proxyGen(ics string) func(c *gin.Context) {
	return func(c *gin.Context) {
		id := c.Param("id")
		token := c.Param("token")
		calendar := c.Param("calendar")
		outlookUrl := URL(id, token, calendar, "reachcalendar.ics")
		fmt.Println(outlookUrl)
		remote, err := url.Parse(outlookUrl)
		if err != nil {
			c.String(500, "Failed to parse url")
			return
		}
		px := httputil.NewSingleHostReverseProxy(remote)
		px.Director = func(req *http.Request) {
			req.Header = c.Request.Header
			req.Host = remote.Host
			req.URL.Scheme = remote.Scheme
			req.URL.Host = remote.Host
			req.URL.Path = remote.Path
		}

		px.ServeHTTP(c.Writer, c.Request)
	}
}
