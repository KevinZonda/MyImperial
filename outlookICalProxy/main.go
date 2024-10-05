package main

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/KevinZonda/GoX/pkg/panicx"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func URL(id, token, calendar string) string {

	return strings.Join([]string{
		"https://outlook.office365.com/owa/calendar",
		id,
		token,
		calendar,
		"reachcalendar.ics",
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

	engine.GET("/calendar/:id/:token/:calendar/reachcalendar.ics", proxy)
	engine.GET("/calendar/:id/:token/:calendar", proxy)
	engine.GET("/owa/calendar/:id/:token/:calendar/reachcalendar.ics", proxy)
	engine.GET("/owa/calendar/:id/:token/:calendar", proxy)
	err := engine.Run(Config.ListenAddr)
	panicx.NotNilErr(err)
}

func proxy(c *gin.Context) {
	id := c.Param("id")
	token := c.Param("token")
	calendar := c.Param("calendar")
	outlookUrl := URL(id, token, calendar)

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
