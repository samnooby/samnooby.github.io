package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
)

type Page struct {
	Stylesheet string
	Javascript string
	Content    template.HTML
}

//Creates page from html, css, and javascript given
func loadPage(page string, style string, javascript string) (*Page, error) {
	loadedPage := &Page{
		Stylesheet: fmt.Sprintf("styles/%s.css", style),
		Javascript: fmt.Sprintf("js/%s.js", javascript),
	}
	content, err := ioutil.ReadFile(fmt.Sprintf("templates/pages/%s.html", page))
	if err != nil {
		return nil, err
	}
	loadedPage.Content = template.HTML(content)
	return loadedPage, nil
}

//Creates the homepage and returns it to the user
func homePageHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/components/base.html")
	homePage, err := loadPage("home", "home", "home")
	if err != nil {
		return
	}
	// newPage := &Page{Stylesheet: "styles/home.css"}
	// homePage.Content = template.HTML("<h1>This is a test</h1>")
	t.Execute(w, homePage)
}

func main() {
	//Sets up the file server, allowing access to javascript and styles
	fileServer := http.FileServer(http.Dir("./static"))

	//Sets up routes for the webpages
	http.HandleFunc("/home", homePageHandler)
	http.Handle("/styles/", fileServer)
	http.Handle("/assets/", fileServer)
	http.Handle("/js/", fileServer)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
