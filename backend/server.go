package backend

import (
	"net/http"
	"net/http/httputil"

	"net/url"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

var renderURL *url.URL

func init() {
	renderURL, _ = url.Parse("https://us-central1-gae-go-functions-ssr-example.cloudfunctions.net/render")
	http.HandleFunc("/", handle)
}

func handle(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	rp := httputil.NewSingleHostReverseProxy(renderURL)
	rp.Transport = &urlfetch.Transport{Context: c}

	rp.ServeHTTP(w, r)
}
