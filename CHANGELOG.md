# __CHANGELOG__

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.18.1] [checkCsvg]
### Changed

- check and fix csvg that this element clear svg and update svg on new custom capture

## [1.17.1] [legendMulti]
### Changed

- change legend fro Multiline

## [1.16.1] [tooltipMultiLine]
### Fixed

- opacity extra Dot

### Added

- add check when tooltip over bottom

## [1.15.1] [scrollTable]
### Changed

- delete scroll table

- remove footer when data.length < 100

- set per-page [100,500,1000,-1]

- set xlsx to download search

## [1.14.1] [levelDatePicker]
### Changed

- change set z-index not form dash-layout, but vdr (moveable.vue)

## [1.13.1] [styleTooltipGantt]
### Changed

- change style tooltip without description

## [1.12.1] [setTickMultiLine]
### Changed

- add check size of elements and fix tick in Multiline

## [1.11.1] [addCaptureToSvg]
### Changed

- attributes form svg elements set not with token, but with capture of data

- change tile border, that tile can paint border in fidderent color

## [1.10.1] [borderTile]
### Added

- border in Tile

## [1.9.1] [svgTooltipClickToken]
### Added

- add click to button in tooltip

## [1.8.1] [improveTile]
### Changed

- add width and height to option in Tile

## [1.7.1] [backToPixel]
### Changed

- back to pixel when resize and remove

## [1.6.2] [doubleTile]
### Fix

- fix bug with double tile on dashboards

## [1.6.1] [cssChange]
### Changed

- all colors in project colors

## [1.5.1] [arrowCsvg]
### Fixed

- fix error with indefined options.tooltip, add check on options.tooltip is exist

## [1.5.0] [mouseOver]
### Added

- add tooltip on mouse over in csvg component

## [1.4.0] [imExp]
### Added

- add expor import dashboards/groups

- add export search to csv file

## [1.3.10] [fixAdaptiv]
### Changed

- change adaptiv (remove Math.floor, add toFixed(1))

## [1.3.9] [filter2.0]
### Added

- add filter to not value (!value)

## [1.3.8] [stringToken]
### Added

- add some field in token (prefix,sufix, delimetr)

- add view mode of token

### Changed

- multiselect instead a normal select

## [1.3.7] [multiline2.0]
### Added

- add second mode in multilineChart, that he can draw every line separeted

- change tootlip from united multiline mode, that he can show all metrics in current point

## [1.3.6] [filtrData]
### Added

- add new Event on filter data

## [1.3.5] [hideHead]
### Changed

- hide all elements exept name of component when switch look 

- remove most margin and padding from most component

## [1.3.4] [stable]
### Changed

- change check options when open modalSetting

- disable loading from button

- fix color from table

## [1.3.3] [fomtSizeOption]
### Changed

- cut name of group/dash on main page

- font-option for single value

## [1.3.2] [modEvent]
### Added

- add change elements  value whom have a need token after move on dashboard after event

## [1.3.1] [dealWithSearch]
### Changed

- change look of modal of search and add adaprtiv in same time

## [1.3.0] [adaptiv]
### Added

- add adaptiv for elements and S&R

## [1.2.11] [fixMulti]
### Changed

- made space between line if value is 0

## [1.2.10] [fixGuntt]
### Changed

- no rotate for x axis

- text on block in the middle

- legend on the right

## [1.2.9] [workToImproveS&R]
### Changed

- fix scroll in search window

- change size of S&R

- add other vizualization (tile,csvg)

- fix multiline to draw one point

## [1.2.8] [Csvg]

### Changed

- add upload btn

- replace token in csvg

- add token and event

## [1.2.7] [modGraph]
### Changed

- fix bug with load dash from back (reactivity losing)

## [1.2.6] [modPlate]
### Changed

- fix bug with cut search sid

- rename Plate to Tile everywhere

- add event to Tile


## [1.2.5] [CSvg]
### Added

- add new component Svg image

## [1.2.4] [hotfix_nocache]
### Changed

- add check nocache status and count that response

## [1.2.3] [hotfix_schema_problem]
### Fixed

- start using SCHEMA for prepare data

## [1.2.2] [fixDateSearch]
### Fixed

- problem with select data for search in Search and Reporting

## [1.2.1]
### Changed

- change LineChart and MultiLineChart, that they can work with just numbers, not only wit timestamp

## [1.2.0]
### Added

- new component Plate

## [1.1.0]
### Added

- new component Guntt based on D3 (instead Guntt based on Google charts) 

## [1.0.0]
### Added

- autorization page
- user panel
    - return to "main" page
    - return to page before
    - log
        - put log
        - clear log
        - restore log
    - edit user profile
        - role modal page with this items - users, roles, permissions, groups and indexes. Every item can create, edit, delete if you obtain right permission.
    - exit on autorization page (clear cookie and store)
- dashboarding constructor
    - page with all available groups and all available dashboards inside current group (create, edit, delete group/ dashboards)
        - dashboard page

            - top panel

                - switch display mode

                - color settings panel

                - event panel

                - token panel

                - search panel

                - tool panel (vaizualization itself)

                - user panel

                - save dashboards

            - dashboard

                - top panel dashboard

                    - icon

                    - name

                    - id

                    - search sid

                    - choose search

                    - resize dashboard

                    - change position dashboard

                    - edit name dashboard

                    - settings dashboard

                    - delete dashboard

                - vizualization block
                
- search and reporting 
    - statistics block
    - search block
        - start search
        - setting search
    - vizualization block