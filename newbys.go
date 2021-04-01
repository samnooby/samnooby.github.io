package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
)

type StringPage struct {
	Name        string
	Content     string
	Stylesheets []string
	Javascripts []string
}

type Page struct {
	Content     template.HTML
	Stylesheets template.HTML
	Javascripts template.HTML
}

var webPages map[string]Page = make(map[string]Page)
var baseTemplate = template.Must(template.ParseFiles("templates/components/base.html"))

func setUpPages() error {
	stringPages := []StringPage{
		{Name: "home", Content: "home", Stylesheets: []string{"home"}, Javascripts: []string{"home"}},
		{Name: "about", Content: "about", Stylesheets: []string{"about"}, Javascripts: []string{"about"}},
		{Name: "projects", Content: "projects", Stylesheets: []string{"projects"}, Javascripts: []string{"projects"}},
		{Name: "resume", Content: "resume", Stylesheets: []string{"resume"}, Javascripts: []string{"resume"}},
		{Name: "dotfiles", Content: "dotfiles", Stylesheets: []string{"dotfiles"}, Javascripts: []string{"dotfiles"}},
		{Name: "contact", Content: "contact", Stylesheets: []string{"contact"}, Javascripts: []string{"contact"}},
		{Name: "notFound", Content: "notFound", Stylesheets: []string{"notFound"}, Javascripts: []string{"notFound"}},
	}

	for _, page := range stringPages {
		newPage, err := loadPage(page.Content, page.Stylesheets, page.Javascripts)
		if err != nil {
			return err
		}
		webPages[page.Name] = *newPage
	}

	return nil
}

//Creates page from html, css, and javascript given
func loadPage(page string, style []string, scripts []string) (*Page, error) {
	//Converts given styling and scripts to link and script tags
	stylesheets, js := "", ""
	for _, style := range style {
		stylesheets = fmt.Sprintf("%s<link rel='stylesheet' href='styles/%s.css'>", stylesheets, style)
	}
	for _, script := range scripts {
		js = fmt.Sprintf("%s<script src='js/%s.js'></script>", js, script)
	}
	loadedPage := &Page{
		Stylesheets: template.HTML(stylesheets),
		Javascripts: template.HTML(js),
	}
	//Gets html content from the html file
	content, err := ioutil.ReadFile(fmt.Sprintf("templates/pages/%s.html", page))
	if err != nil {
		return nil, err
	}
	loadedPage.Content = template.HTML(content)
	return loadedPage, nil
}

//The route handler
func pageHandler(w http.ResponseWriter, r *http.Request) {
	//Gets the page from the webpages
	page := r.URL.Path[1:]
	pageContent, exists := webPages[page]
	if !exists {
		pageContent = webPages["notFound"]
	}
	//Creates the page with  the base template
	err := baseTemplate.Execute(w, pageContent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	setUpPages()
	//Sets up the file server, allowing access to javascript and styles
	fileServer := http.FileServer(http.Dir("./static"))

	//Sets up routes for the webpages
	http.HandleFunc("/", pageHandler)

	//Creates the fileserver the pages will use to access styles and javascript
	http.Handle("/styles/", fileServer)
	http.Handle("/assets/", fileServer)
	http.Handle("/js/", fileServer)

	log.Fatal(http.ListenAndServe(":8000", nil))
}
