# Audioguide

## Getting started

On MacOSX, get Yarn via Homebrew so it will be easily upgradable.

Cd in this repository then:

`yarn install`

This will install both run-time project dependencies and developer tools listed in package.json file.

`yarn start`

This command will build the app from the source files (/src) into the output /build folder. As soon as the initial build completes, it will start the Node.js server (node build/server.js) and Browsersync with HMR on top of it.

`yarn run storybook`

Starts the UI component dev environment.

## Prototype

[Hi-fi prototype](https://tiltfactory.prevue.it/p/5oa6)

## Nomenclature

- Itinerary and Stop: an itinerary has several "stops". Example: The "Objects" itinerary has the "Toots Thielemans" and "Expo 58" stops.
- Answer: an optional answer that can be given by the user during a stop.

## Drupal content model

Each content entity is fully translatable via Drupal and exposed with JSON API.

### Itinerary

Taxonomy vocabulary, machine name: **audio_itinerary**

- Name (1)
- Image (1)
- Formatted long text (0..1)

### Stop

Content type, machine name: **audio**

- Title (1)
- Identifier (1)
- Image (1)
- MP3 (1)
- Formatted long text (0..1)
- Itinerary (1)
- Answer (1..*)

### Answer

Paragraph, machine name: **audio_answer**

- Title (1)
- Formatted long text (1)
- MP3 file (1)

## Components

### Top level component

**App**



### Pages an routes

React components that will be available from routes.

- / and /itineraries: **[ItineraryListPage](https://tiltfactory.prevue.it/view/ifkjvw)**
- /itinerary/:itinerary_id **[StopListPage](https://tiltfactory.prevue.it/view/gwbjq2)**
- /itinerary/:itinerary_id/:stop_id **[StopDetailPage](https://tiltfactory.prevue.it/view/6ztppa)**: Stop detail page, with optional answer: [playing](https://tiltfactory.prevue.it/view/ge1aaq), [stopped](https://tiltfactory.prevue.it/view/ln8s60).
- /about **AboutPage**: About page (@todo).

### Specific components, per page

#### ItineraryListPage

- ItineraryListHeader
  - Link: About page link
  - Logo: svg image
  - LanguageSwitcher
- ItineraryList
  - ItineraryTeaser: link to an itinerary with: thumbnail image (?), icon, title

#### StopListPage

- StopListHeader
  - Link: back to the itinerary list page.
  - Image: (?)
  - Title
  - LanguageSwitcher
- FilterableStopList
  - Search
  - StopList
    - StopTeaser: thumbnail image, id, title, mp3 length 

#### StopDetailPage

- StopHeader
  - Link: back to the current itinerary stop list page.
  - StopLocation: itinerary title and stop id
  - Title
  - LanguageSwitcher
- AudioPlayer
- Text
- AudioAnswer: optional audio answer

### Generic components

- LanguageSwitcher

## Documentation 

- [Boilerplate description](./REACT_STARTER_KIT.md)
- [Boilerplate documentation](./docs/README.md)
