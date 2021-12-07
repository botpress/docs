module.exports={
  "title": "| Developer's Guide",
  "tagline": "Guides and references for all you need to know about Botpress",
  "url": "https://botpress.com/",
  "baseUrl": "/",
  "organizationName": "botpress",
  "projectName": "botpress-docs",
  "scripts": [
    "https://buttons.github.io/buttons.js",
    "/js/hotjar.js"
  ],
  "favicon": "img/favicon.png",
  "customFields": {
    "repoUrl": "https://github.com/botpress/docs",
    "botpressServerUrl": "https://github.com/botpress/botpress",
    "gaGtag": true
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "homePageId": "introduction",
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "editUrl": "https://github.com/botpress/docs/edit/master/docs/",
          "path": "../docs",
          "sidebarPath": "../websiteV2/sidebars.json"
        },
        "blog": {},
        "theme": {
          "customCss": "../src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "| Developer's Guide",
      "logo": {
        "src": "img/botpress_icon.svg"
      },
      "items": [
        {
          "to": "docs/",
          "label": "Docs",
          "position": "left"
        },
        {
          "href": "https://botpress.com/reference/",
          "label": "SDK",
          "position": "left"
        },
        {
          "href": "https://forum.botpress.com/",
          "label": "Community",
          "position": "left"
        },
        {
          "href": "https://github.com/botpress/docs",
          "label": "Github",
          "position": "left"
        },
        {
          "label": "Version",
          "to": "docs",
          "position": "right",
          "items": [
            {
              "label": "12.26.7",
              "to": "docs/",
              "activeBaseRegex": "docs/(?!11.0.1|11.0.2|11.0.3|11.0.4|11.2.0|11.3.0|11.4.0|11.4.1|11.4.2|11.5.0|11.5.1|11.6.0|11.6.1|11.6.2|11.6.3|11.7.0|11.7.1|11.7.2|11.7.3|11.7.4|11.8.0|11.8.1|11.8.2|11.8.3|11.8.4|11.9.0|11.9.1|11.9.2|11.9.3|11.9.4|11.9.5|11.9.6|12.0.0|12.0.1|12.0.2|12.0.3|12.0.4|12.0.5|12.0.6|12.0.7|12.1.0|12.1.1|12.1.2|12.1.3|12.1.4|12.1.5|12.1.6|12.2.0|12.2.1|12.2.2|12.2.3|12.3.0|12.3.1|12.3.2|12.3.3|12.4.0|12.4.1|12.4.2|12.5.0|12.6.0|12.6.1|12.7.0|12.7.1|12.7.2|12.8.0|12.8.1|12.8.2|12.8.3|12.8.4|12.8.5|12.8.6|12.9.0|12.9.1|12.9.2|12.9.3|12.10.0|12.10.1|12.10.2|12.10.3|12.10.4|12.10.5|12.10.6|12.10.7|12.10.8|12.10.9|12.10.10|12.11.0|12.12.0|12.12.1|12.13.0|12.13.1|12.13.2|12.14.0|12.14.1|12.14.2|12.15.0|12.15.1|12.15.2|12.16.0|12.16.1|12.16.2|12.16.3|12.17.0|12.17.1|12.17.2|12.18.0|12.18.1|12.18.2|12.19.0|12.19.1|12.19.2|12.20.0|12.20.1|12.20.2|12.21.0|12.21.1|12.22.0|12.22.1|12.22.2|12.23.0|12.23.1|12.23.2|12.24.0|12.24.1|12.25.0|12.26.0|12.26.1|12.26.2|12.26.3|12.26.4|12.26.7|next)"
            },
            {
              "label": "12.26.4",
              "to": "docs/12.26.4/"
            },
            {
              "label": "12.26.3",
              "to": "docs/12.26.3/"
            },
            {
              "label": "12.26.2",
              "to": "docs/12.26.2/"
            },
            {
              "label": "12.26.1",
              "to": "docs/12.26.1/"
            },
            {
              "label": "12.26.0",
              "to": "docs/12.26.0/"
            },
            {
              "label": "12.25.0",
              "to": "docs/12.25.0/"
            },
            {
              "label": "12.24.1",
              "to": "docs/12.24.1/"
            },
            {
              "label": "12.24.0",
              "to": "docs/12.24.0/"
            },
            {
              "label": "12.23.2",
              "to": "docs/12.23.2/"
            },
            {
              "label": "12.23.1",
              "to": "docs/12.23.1/"
            },
            {
              "label": "12.23.0",
              "to": "docs/12.23.0/"
            },
            {
              "label": "12.22.2",
              "to": "docs/12.22.2/"
            },
            {
              "label": "12.22.1",
              "to": "docs/12.22.1/"
            },
            {
              "label": "12.22.0",
              "to": "docs/12.22.0/"
            },
            {
              "label": "12.21.1",
              "to": "docs/12.21.1/"
            },
            {
              "label": "12.21.0",
              "to": "docs/12.21.0/"
            },
            {
              "label": "12.20.2",
              "to": "docs/12.20.2/"
            },
            {
              "label": "12.20.1",
              "to": "docs/12.20.1/"
            },
            {
              "label": "12.20.0",
              "to": "docs/12.20.0/"
            },
            {
              "label": "12.19.2",
              "to": "docs/12.19.2/"
            },
            {
              "label": "12.19.1",
              "to": "docs/12.19.1/"
            },
            {
              "label": "12.19.0",
              "to": "docs/12.19.0/"
            },
            {
              "label": "12.18.2",
              "to": "docs/12.18.2/"
            },
            {
              "label": "12.18.1",
              "to": "docs/12.18.1/"
            },
            {
              "label": "12.18.0",
              "to": "docs/12.18.0/"
            },
            {
              "label": "12.17.2",
              "to": "docs/12.17.2/"
            },
            {
              "label": "12.17.1",
              "to": "docs/12.17.1/"
            },
            {
              "label": "12.17.0",
              "to": "docs/12.17.0/"
            },
            {
              "label": "12.16.3",
              "to": "docs/12.16.3/"
            },
            {
              "label": "12.16.2",
              "to": "docs/12.16.2/"
            },
            {
              "label": "12.16.1",
              "to": "docs/12.16.1/"
            },
            {
              "label": "12.16.0",
              "to": "docs/12.16.0/"
            },
            {
              "label": "12.15.2",
              "to": "docs/12.15.2/"
            },
            {
              "label": "12.15.1",
              "to": "docs/12.15.1/"
            },
            {
              "label": "12.15.0",
              "to": "docs/12.15.0/"
            },
            {
              "label": "12.14.2",
              "to": "docs/12.14.2/"
            },
            {
              "label": "12.14.1",
              "to": "docs/12.14.1/"
            },
            {
              "label": "12.14.0",
              "to": "docs/12.14.0/"
            },
            {
              "label": "12.13.2",
              "to": "docs/12.13.2/"
            },
            {
              "label": "12.13.1",
              "to": "docs/12.13.1/"
            },
            {
              "label": "12.13.0",
              "to": "docs/12.13.0/"
            },
            {
              "label": "12.12.1",
              "to": "docs/12.12.1/"
            },
            {
              "label": "12.12.0",
              "to": "docs/12.12.0/"
            },
            {
              "label": "12.11.0",
              "to": "docs/12.11.0/"
            },
            {
              "label": "12.10.10",
              "to": "docs/12.10.10/"
            },
            {
              "label": "12.10.9",
              "to": "docs/12.10.9/"
            },
            {
              "label": "12.10.8",
              "to": "docs/12.10.8/"
            },
            {
              "label": "12.10.7",
              "to": "docs/12.10.7/"
            },
            {
              "label": "12.10.6",
              "to": "docs/12.10.6/"
            },
            {
              "label": "12.10.5",
              "to": "docs/12.10.5/"
            },
            {
              "label": "12.10.4",
              "to": "docs/12.10.4/"
            },
            {
              "label": "12.10.3",
              "to": "docs/12.10.3/"
            },
            {
              "label": "12.10.2",
              "to": "docs/12.10.2/"
            },
            {
              "label": "12.10.1",
              "to": "docs/12.10.1/"
            },
            {
              "label": "12.10.0",
              "to": "docs/12.10.0/"
            },
            {
              "label": "12.9.3",
              "to": "docs/12.9.3/"
            },
            {
              "label": "12.9.2",
              "to": "docs/12.9.2/"
            },
            {
              "label": "12.9.1",
              "to": "docs/12.9.1/"
            },
            {
              "label": "12.9.0",
              "to": "docs/12.9.0/"
            },
            {
              "label": "12.8.6",
              "to": "docs/12.8.6/"
            },
            {
              "label": "12.8.5",
              "to": "docs/12.8.5/"
            },
            {
              "label": "12.8.4",
              "to": "docs/12.8.4/"
            },
            {
              "label": "12.8.3",
              "to": "docs/12.8.3/"
            },
            {
              "label": "12.8.2",
              "to": "docs/12.8.2/"
            },
            {
              "label": "12.8.1",
              "to": "docs/12.8.1/"
            },
            {
              "label": "12.8.0",
              "to": "docs/12.8.0/"
            },
            {
              "label": "12.7.2",
              "to": "docs/12.7.2/"
            },
            {
              "label": "12.7.1",
              "to": "docs/12.7.1/"
            },
            {
              "label": "12.7.0",
              "to": "docs/12.7.0/"
            },
            {
              "label": "12.6.1",
              "to": "docs/12.6.1/"
            },
            {
              "label": "12.6.0",
              "to": "docs/12.6.0/"
            },
            {
              "label": "12.5.0",
              "to": "docs/12.5.0/"
            },
            {
              "label": "12.4.2",
              "to": "docs/12.4.2/"
            },
            {
              "label": "12.4.1",
              "to": "docs/12.4.1/"
            },
            {
              "label": "12.4.0",
              "to": "docs/12.4.0/"
            },
            {
              "label": "12.3.3",
              "to": "docs/12.3.3/"
            },
            {
              "label": "12.3.2",
              "to": "docs/12.3.2/"
            },
            {
              "label": "12.3.1",
              "to": "docs/12.3.1/"
            },
            {
              "label": "12.3.0",
              "to": "docs/12.3.0/"
            },
            {
              "label": "12.2.3",
              "to": "docs/12.2.3/"
            },
            {
              "label": "12.2.2",
              "to": "docs/12.2.2/"
            },
            {
              "label": "12.2.1",
              "to": "docs/12.2.1/"
            },
            {
              "label": "12.2.0",
              "to": "docs/12.2.0/"
            },
            {
              "label": "12.1.6",
              "to": "docs/12.1.6/"
            },
            {
              "label": "12.1.5",
              "to": "docs/12.1.5/"
            },
            {
              "label": "12.1.4",
              "to": "docs/12.1.4/"
            },
            {
              "label": "12.1.3",
              "to": "docs/12.1.3/"
            },
            {
              "label": "12.1.2",
              "to": "docs/12.1.2/"
            },
            {
              "label": "12.1.1",
              "to": "docs/12.1.1/"
            },
            {
              "label": "12.1.0",
              "to": "docs/12.1.0/"
            },
            {
              "label": "12.0.7",
              "to": "docs/12.0.7/"
            },
            {
              "label": "12.0.6",
              "to": "docs/12.0.6/"
            },
            {
              "label": "12.0.5",
              "to": "docs/12.0.5/"
            },
            {
              "label": "12.0.4",
              "to": "docs/12.0.4/"
            },
            {
              "label": "12.0.3",
              "to": "docs/12.0.3/"
            },
            {
              "label": "12.0.2",
              "to": "docs/12.0.2/"
            },
            {
              "label": "12.0.1",
              "to": "docs/12.0.1/"
            },
            {
              "label": "12.0.0",
              "to": "docs/12.0.0/"
            },
            {
              "label": "11.9.6",
              "to": "docs/11.9.6/"
            },
            {
              "label": "11.9.5",
              "to": "docs/11.9.5/"
            },
            {
              "label": "11.9.4",
              "to": "docs/11.9.4/"
            },
            {
              "label": "11.9.3",
              "to": "docs/11.9.3/"
            },
            {
              "label": "11.9.2",
              "to": "docs/11.9.2/"
            },
            {
              "label": "11.9.1",
              "to": "docs/11.9.1/"
            },
            {
              "label": "11.9.0",
              "to": "docs/11.9.0/"
            },
            {
              "label": "11.8.4",
              "to": "docs/11.8.4/"
            },
            {
              "label": "11.8.3",
              "to": "docs/11.8.3/"
            },
            {
              "label": "11.8.2",
              "to": "docs/11.8.2/"
            },
            {
              "label": "11.8.1",
              "to": "docs/11.8.1/"
            },
            {
              "label": "11.8.0",
              "to": "docs/11.8.0/"
            },
            {
              "label": "11.7.4",
              "to": "docs/11.7.4/"
            },
            {
              "label": "11.7.3",
              "to": "docs/11.7.3/"
            },
            {
              "label": "11.7.2",
              "to": "docs/11.7.2/"
            },
            {
              "label": "11.7.1",
              "to": "docs/11.7.1/"
            },
            {
              "label": "11.7.0",
              "to": "docs/11.7.0/"
            },
            {
              "label": "11.6.3",
              "to": "docs/11.6.3/"
            },
            {
              "label": "11.6.2",
              "to": "docs/11.6.2/"
            },
            {
              "label": "11.6.1",
              "to": "docs/11.6.1/"
            },
            {
              "label": "11.6.0",
              "to": "docs/11.6.0/"
            },
            {
              "label": "11.5.1",
              "to": "docs/11.5.1/"
            },
            {
              "label": "11.5.0",
              "to": "docs/11.5.0/"
            },
            {
              "label": "11.4.2",
              "to": "docs/11.4.2/"
            },
            {
              "label": "11.4.1",
              "to": "docs/11.4.1/"
            },
            {
              "label": "11.4.0",
              "to": "docs/11.4.0/"
            },
            {
              "label": "11.3.0",
              "to": "docs/11.3.0/"
            },
            {
              "label": "11.2.0",
              "to": "docs/11.2.0/"
            },
            {
              "label": "11.0.4",
              "to": "docs/11.0.4/"
            },
            {
              "label": "11.0.3",
              "to": "docs/11.0.3/"
            },
            {
              "label": "11.0.2",
              "to": "docs/11.0.2/"
            },
            {
              "label": "11.0.1",
              "to": "docs/11.0.1/"
            },
            {
              "label": "Main/Unreleased",
              "to": "docs/next/",
              "activeBaseRegex": "docs/next/(?!support|team|resources)"
            }
          ]
        }
      ]
    },
    "image": "img/docusaurus.png",
    "footer": {
      "links": [],
      "copyright": "Copyright © 2021 Botpress, Inc.",
      "logo": {
        "src": "img/botpress.svg"
      }
    },
    "algolia": {
      "apiKey": "570227d66d130d069630e7226c740158",
      "indexName": "botpress",
      "algoliaOptions": {
        "facetFilters": [
          "version:VERSION"
        ]
      }
    },
    "gtag": {
      "trackingID": "UA-90034220-1"
    }
  }
}