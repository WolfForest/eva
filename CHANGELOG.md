# **CHANGELOG**

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [1.152.1]

### Added
- Apexcharts library
- Visualization: Polar area
- Visualization: Columns
- Visualization: Mixed

## [1.152.0]

### Added
- TableV2: added number formatting for new column types (riskAcc, riskFact, riskSum)

### Changed
- Changed the position of input elements in the data source popup
- Fixed the color of the search button in the text block
- TableV2: Changed the color of values and graphs in the table to a brighter color
- TableV2: Changed checking of values for graphs in the table, now you can specify values without floating point.

### Fixed
- Translated errors when uploading a file to the server
- Data Research: Problem with reloading the selected visualization
- TableV2: Fixed handling of null values in cells with charts.
- TableV2: Fixed incorrect table behavior when saving a dashboard. (Column order was changed to default)
- TableV2: Fixed the operation of moving columns.
- TableV2: Fixed formatting of numbers.(previously applied not only to numbers)

## [1.151.0]

### Added
- TableV2: handling "_columnOptions" in DS for setting columns options
- TableV2: added new column types: riskAcc, riskFact, riskSum

### Changed
- The action buttons in the component settings are stuck to the bottom edge of the modal window
- cSvg: reset image when there is no filename in the data source.

### Fixed
- Generation of component ID. The order of suffixes of the component ID suffixes added to the dashboard was incorrect in some cases.
- cSvg component does not set the click token value.
- Wrong text in the table when loading the dashboard "data is not displayed due to settings"
- Table: Changing the token causes a reset to the first page.
- Select, Textarea: If the component is on a different tab, the default value is not set.

## [1.150.0]

### Added
- Event click for component accumulator
- Event click for component frequency graph

### Fixed
- change color of log`s icon when DS has finish with error
- fix panel background flickering when changing background to transparent

## [1.149.0]

### Added
- word break to notify in notify modal
- Multiline: added single y-axis
- Gauge: added display in the labels of the value after the comma

### Changed
- textarea to code editor in DS's create modal

### Fixed
- Dash-options: The primitives library has been returned to the settings
- Accumulators: sometimes the settings fly off and the size is reset
- Printer page size and colors
- RiskReview: fixed display of more than 10 elements

## [1.148.0]

### Added
- notify modal
- Risk-review: Added placeholder on field options
- Added auto-resize dashboard tree panel

### Changed
- Risk-review: Changed color-picker in options panel.
- remove saving notify between sessions

### Fixed
- TableV2: Fixed color on hover\select row
- Risk-review: Fixed suffixed \[_title], \[_list_title] 
- Risk-review: Fixed work of tokens
- Multiline: Data goes off the Y axis
- Prefix and suffix not working on components: Gantt, Tables, PieChart, Multiline, Tune, Tiles, Heatmap, TextArea, timePicker, ScatterPlot, Map, YGraph


## [1.147.0]

### Added
- Sorting data sources
- Mouse middle click by group tile and dashboard tile
- Table event OnDataCompare: 
  - Ability use the token in the value
  - Ability to use regular expressions in the column name
- Notify on data source error
- Optional notify on data source finished
- Risk-review: Added auto-generated options for metric
- Risk-review: Added documentation on create visualisation
- Risk-review: Added options panel

### Changed
- removed libraries yFiles and license from project
- Data source design
- Risk-review: Delete primitives library
- Risk-review: Changed fields naming for metrics from 'risk, measure, riskfactor' to '\[main_metric_1], \[main_metric_2]'+suffixes '_title, _list_title, \_list_text\_\[0-1-2...], \_list_value\_\[0-1-2...]'

### Fixed
- Risk-review: Fixed visible single bar

## [1.146.0]

### Added
- TableV2: number formatting
- Risk-review: Added setting to hide metrics with zero values
- Risk-review: Hide description if metric value = 0
- Risk-review: Added auto-resize on change textOffset options

### Changed
- Risk-review: Changed inner padding from 40px to 5px
- Risk-review: Changed outer padding from 40px to 5px

### Fixed
- Select does not activate visualization
- Risk-review: Fixed visualization container
- Multiline: tooltip is clipped outside the graph

## [1.145.1]

### Fixed
- Waterfall: print zero line, width of comments

## [1.145.0]

### Changed
- Waterfall: Optimizing the size of the comment text
- Risk-review: Legend moved from the tooltip to the main visualization

### Fixed
- Problem with select list overlapped by other panels
- Risk-review: Fixed processing of large numbers
- Gauge: Fixed size in small container

## [1.144.0]

### Added
- Button: Added event "click(visualisation-id, download(sid))"

### Fixed
- Waterfall: Fixed resize after change tab

## [1.143.0]

### Added
- Waterfall: Added legend
- Waterfall: Added grouping bars

## [1.142.0]

### Added
- Ability to upload a file to the server
- Constructor-schemes: Added auto-close and clear data-panel on copy\paste

### Fixed
- When downloading the result in csv, the columns may float
- Tokens: not all fields exist at the time of token editing
- Constructor-schemes: Fixed Incorrect coordinates of copied items
- Gauge: Text is cut off
- Waterfall: Does not redraw in the absence of data
- RiskReview: More place for numerical values

## [1.141.0]

### Added
- Table v2: Added auto resize text-field in header-filter
- Waterfall: added column coloring via otl

### Fixed
- Table v2: Fixed table flickering when switching edit mode
- Waterfall: No relation to number formatting setting in comments
- Map: Fixed search
- When switching to a tab with a datepicker, the data source is restarted
- Gauge: fixed intersection of numbers
- RiskReview: fixed display of unused columns

## [1.140.0]

### Added
- Tiles: Switch to dash by clicking on the wheel in a new tab

### Fixed
- Select: first filtered item has cursor for select by Enter
- TableV2: 
  - Undefined in token
  - Fields in tokens are not updated

## [1.139.0]

### Added
- SingleValue: Added options from otl
- Map: Added option zoom level for search

### Changed
- Select: first filtered item has cursor for select by Enter
- Hide Q&A page
- Change title "Исследование данных 2.0\Исследование данных" 

### Fixed
- Select: First click disappears when clicking on selects
- textarea: the value is reset on the apply button
- Select: Fixed scroll
- Button: The same names for settings for different functionality
- Button: the onclick event doesn't work when the 'onButtonToken' or 'onButton' option is enable

## [1.138.0]

### Fixed
- Fixed searches to maps

## [1.137.0]

### Added
- Multiselect: New event 'closemenu'
- Multiselect: hidden list by pressing enter

### Fixed
- Table-v2: fixed save moved column position
- Table-v2: events do not work when creating a dashboard

## [1.136.0]

### Added
- Table-v2: Added auto-resize columns so they fit perfectly in the available table width
- Table-v2: Added text transfer in table cells

### Fixed
- The scroll on the dashboard hangs if you open a large tree
- TableV2: Fixed save visible columns
- Table-v2: Fixed incorrect change in the visibility of fixed columns
- Table-v2: Fixed update data on data-research page
- Single-value: Fixed display of zero in single-value

## [1.135.0]

### Added
- applying the filtered value by Enter in the select component if it matches the query
- Main setting: decimal places limits
- Table: added option to limit decimal places
- Risk-review: Added settings: idStart (starting point for line drawing), textPosY (vertical text position: center\top\bottom), textPosX (horizontal text position: center\default), textOffset (horizontal text offset from line), textColor
- Table-v2: Added ctrlClick\click event

### Changed
- Updated logic for changing the title of the browser tab

### Fixed
- Risk-review: Fixed incorrect processing of empty values for captions

## [1.134.1]

### Fixed
- Processing point in table field name

## [1.134.0]

### Added
- Added visualization "Table v2"
- Replaced "Table" visualization with "Table v2".
- Added visualization Gauge in gridGroup component
- Ability to hide legend in Risk Review

### Fixed
- The names of the dashboards are now not fully displayed
- table-v2: fixed save filters by toggle fullscreen-mode
- table-v2: fixed incorrect sorting number values
- table-v2: fixed the pagination block

## [1.133.1]

### Added
- Added user setting to switch from "Designing Dashboards" directly to the dashboard tree
- Added position sticky by first column and header-row

### Fixed
- Problem with SingleValue Initialization in GridGroup component
- Single value has a checkbox that adds free space instead of the component header
- Multiselect: the query in the filter is cleared after pressing Enter
- Multiselect: Hangs when changing values on heavy dashboards
- Default value of textArea not set
- GridGroup: When using zoom, there is an offset for the multiline
- Heatmap: Fixed incorrect x\y scroll inside visualisation

## [1.132.0]

### Added
- Added the dial visualization in gridGroup component
- Multiselect: added the ability to pin selected values above the list

### Changed
- Multiselect: sorting values in list
- The scroll bar on the dashboard has become more convenient

### Fixed
- dynamic visualizations: the same settings for the same type of visualizations

## [1.131.0]

### Added
- Save theme in user settings

### Fixed
- multiline does not work correctly with string values

## [1.130.0]

### Added
- Waterfall: highlight numbers in comments
- Waterfall: text wrapping on the x-axis
- Added the ability to build multiple signatures from a data source on the "ConstructorSchemes"
- Multiselect: added setting "variant search"
- Multiselect: if after entering the search in the multiline there is one option, then select it by entry
- Added tree icon in header
- Added auto-centered Map
- Added centered Map by token
- Added search by objects Map

### Fixed
- Heatmap: events don't pass token values
- Map: fixed incorrect update token with action "click"
- RiskReview: Fixed incorrect resizing when switching between "full screen", "modal" and "default mode"

## [1.129.0]

### Added
- Added user setting: number formatting
- Added options: "leftTitle", "rightTitle", "leftValueColor", "rightValueColor", "primitivesLibrary" for visualization "risk-review"
- Added text formatting for visualization "risk-review"
- Added division of numbers into digits for visualization "risk-review"
- Added an icon for visualization "risk-review"
- Added "+\-" to numbers in text blocks for visualization "risk-review"

### Fixed
- Fixed indention for text blocks in case of absence of column header for visualization "risk-review".
- Fixed the size of the "risk-review" visualization

## [1.128.0]

### Added
- Table component: added option "highlight selected row"
- Display a comments on the waterfall chart
- Added visualisation "risk-review"

### Changed
- DatePicker intervals moves with date

### Fixed
- showing selected type of interval after page refresh
- Gauge labels overlap each other 

## [1.127.0]

### Added
- Constructor-schemes: added dynamic-image node
- onDataCompare added ability to compare cells with cells
- Visualizations. Added the ability to download the result in xlsx

### Fixed
- Storage data quota exceeded
- Constructor-schemes: incorrect save scheme to store

## [1.126.0]

### Added
- Multiline: added metric option "don't split line"
- Multiline: added metric option "line by steps"
- Constructor-schemes: added x\y coords into fromOtl object

### Changed
- Optimized dashboard loading time

### Fixed
- Multiline: showing dot's caption
- Constructor-schemes: json size is doubled when switching tabs on dashboard

## [1.125.0]

### Fixed
- Element display issues due to z-index

## [1.124.0]

### Added
- Constructor schemes: token-actions - click:el-parent-[type], click:el-child-all, click:el-child-[type], click:el-other

## [1.123.0]

### Added
- Constructor-schemes: the ability to remove a scheme from the list of saved schemes
- Constructor-schemes: token-action click:image
- Constructor-schemes: import\export schemes
- User's TTL settings

### Fixed
- constructor-schemes: import\export on click to "orderTo" button

## [1.122.0]

### Added
- Constructor-schemes: save multiple schemes by token
- Group sorting

### Fixed
- SingleValue: component menu didn't closet
- Dashboard name doesn't fit when saving dashboard
- Dashboard sorting not working

## [1.121.0]

### Added
- Gauge component
- Waterfall component
- Constructor-schemes: build scheme from search

### Fixed
- Constructor-schemes: setting default elements didn't work
- Constructor-schemes: element "hoarder"(data-type-2) didn't work

## [1.120.0]

### Added
- Constructor-schemes: table-node: Entering values for the left column manually.
- Constructor-schemes: added timeout for schema saving

### Changed
- Do not highlight dashboard when edit mode is disabled
- Constructor-schemes: change font family to "ProximaNova", sans-serif

### Fixed
- Not working custom categories
- Fixed singleValue: coloring text value
- Fixed transitions from the map
- Constructor-schemes: "transparent background" setting didn`t work

## [1.119.0]

### Added
- Added gen_distr command description
- Added saving/loading of all elements in the "constructor-schemes" as an array of objects with parameters for creating an element
- Added rgba color for text-node in the "constructor-schemes"
- Added click event in the "constructor-schemes"
- Added data-node value color from dataset in the "constructor-schemes"

### Changed
- Update yFiles to v25.0.1
- Update yFiles license to 2.4

## [1.118.0]

### Added
- Bush: added the ability to change the label color
- GIS: Added onctrlclick event for Ctrl+Click transition
- Added undo/redo(ctrl+z/ctrl+y) on constructor-schemes

### Fixed
- Component settings. Centering the filling of the library of primitives
- GIS: fixed display of tooltip above areas
- GIS: fixed click event
- Constructor-schemes: GraphViewerInputMode is not active default
- Constructor-schemes: Incorrect start search from component settings

## [1.117.0]

### Added
- Multiline: added the x axis value in tooltip
- Multiline: added setting to show ticks on x-axis by points
- Added load icons list from datasource in constructor-schemes

### Changed
- Changed the filtering logic in the navigation tree

### Fixed
- Fixed incorrect size select-items on settings-panel in constructor-schemes

## [1.116.0]

### Added
- Customizable sections in the navigation menu
- Added display of data object id under the object selection select on constructorSchemes.
- Added fitGraph button on constructorSchemes
- Added change background size data-node on constructorSchemes
- Added copy\paste fn for ConstructorSchemes
- Added token interaction with filter

### Changed
- Home group selection now has a filter

### Fixed
- Bug when home group does not exist
- Background color for time selection in the searching reporting and tooltip text color in dark theme
- Disabled "cut" method on constructor-schemes as it did not work correctly

## [1.115.0]

### Added
- The ability to create an arbitrary number of tokens per element for one event.
- "Reset values if data source does not contain them" option to select

### Changed
- Change icons list settings

### Fixed
- Fixed spontaneous change in the case of the first letters of words in the title of dashboards

## [1.114.0]

### Added
- dynamicForm: Added step to slider

### Fixed
- Run searches from admin username
- Multiselect. The selectable property from the list in the token is ignored

## [1.113.0]

### Added
- Added line wrap on textarea
- Button. Added the ability to reset tokens on click
- Navigation panel on dash page
- Redirect back after login
- Url for group page
- Section "Tree"

### Changed
- Visual button change

### Fixed
- Fixed events on visualisation "select"
- Fixed line wrap on textarea after update token
- Token refresh confirmation window appears in the wrong place

## [1.112.0]

### Fixed
- Calendar: the sixth row of the table with numbers is covered by another element, as a result of which the last days in some months are not visible
- The name of the visualization does not fit to display

## [1.111.0]

### Added
- Added alert for schema read error

### Fixed
- Fixed selection in visualization groups component
- Disabled logging when taking a screenshot
- fix labels in dynamicForm for radio and checkbox
- fix OnTokenCompare set event

## [1.110.0]

### Added
- Added ability to hide the time selector in the datetime picker
- Added it is possible to change the color of the gantt visualization
- Added the group settings for the multiline
- Added the ability to draw vertical lines on a multiline chart

### Fixed
- Fixed a bug with the presence of a dot in the name of the data column
- Fixed issue with resetting options when saving settings

## [1.109.0]

### Added
- Added visualization Frequency graph
- Added the Dash group visualization

### Changed
- The component menu has become more compact 

### Fixed
- Fixed DS selection button on constructor-schemes
- Fixed a lot of errors when initializing a new map

## [1.108.0]

### Added
- DataPicker: Added settings for displaying the input date and time
- DataPicker: Added the ability to format the result
- Added code editor for primitivesLibrary field
- DynamicFormDash
- Added the ability to assign an icon via metadata
- Added ability to correct color via metadata
- ConstructorSchemes: Added loading svg icons from server
- ConstructorSchemes: Added data source support
- Added possibility save multiLine in png
- Text Area: added read only mode

### Changed
- Renaming the single value component
- Removed the board for textarea

### Fixed
- fixed update of tokens on the map
- fixed position icons\buttons on dash panel
- fixed flickering map

## [1.107.0]

### Added
- Added default dashboard assignment for users

## [1.106.0]

### Added
- Schemes constructor: Added icons and tooltips on "toggle-order" buttons
- Schemes constructor: Added tooltip on "toggle-editor-mode" button
- Schemes constructor: Added tooltip on "options-panel" button
- Added redirect to '404' on switch to a non-existent dashboard

### Changed
- The animation of the transition of the visualization dialog box to full-screen mode has been changed

### Fixed
- The size of the text changed when it was selected in full-screen visualizations

## [1.105.0]

### Added
- Added the ability to get the value of the column selected in the settings when clicking on a table row
- Added the ability to follow various links from chamomile petals on the geo-dashboard
- Added the ability to put a bitmap image file under SVG
- Added regression line for scatter plot
- Added theme save

### Fixed
- Fixed select, set token on click
- Multiline. Rounding stopped working for data signing
- Multiline. The first metric for the X-axis is not perceived

## [1.104.0]

### Added
- Added changing the map layer through tokens
- Added token transfer to datepicker

### Changed
- Changed popup on graph

### Fixed
- Fixed transitions on click on html elements
- Fixed subfilter reset via common button
- Fixed go event when passing tokens using spaces
- Extra spaces appear when using tokens
- Tabs scroll disappeared
- Fixed, grammatical errors and bush component

## [1.103.0]

### Added
- Added editable legend title in GIS component
- Schemes constructor: added keymap panel
- Added internal table filter resets

### Changed
- Changed text btn in searchModal

### Fixed
- Fixed map update primitive-libraries
- Fixed event on data compare

## [1.102.0]

### Added
- Added restriction on loading svg
- Added font size settings on text-block in constructor schemes

### Changed
- Deleted old version yFiles
- Changed border color on table
- Changed popup-menu position on heatmap

### Fixed
- Fixed svg. Onclick event
- Fixed Dial. Component header cannot be hidden
- Fixed range-date-picker size
- Fixed heatmap on DR 2.0: tooltip background-color
- Fixed reset manual filter

## [1.101.0]

### Added
- Added visualization of a scatter chart
- The button component now has the option to choose which tokens to update on click
- Ability to paint the area between the line and 0 on a multiline chart
- Ability to change the metric for the x axis on a multiline chart 
- Ability to move tabs on the dashboard
- Added dashSingleValue: number of digits
- Added dashSingleValue: switch "whether to split the number into digits"
- Constructor-schemes. Added settings for label
- Added ability to remove ports
- Added inability to add a label to the "port" component

### Fixed
- Fixed constructor-schemes, ports and standard elements
- Fixed graph. Component breaks after restart
- Fixed problem with association tokens with Select visualisation
- When exporting dashboards without selected elements, the resulting page wasn't found
- Fixed Graph. Signature location
- Fixed data source not loading when entering the dashboard
- Fixed missing scrollbar for event list on dashboard
- Fixed setting "visible" on component
- Fixed display metric on yGraph edges
- Fixed incorrect arrows on yGraph edges

## [1.100.1]

### Fixed
- Fixed missing token name after rename

## [1.100.0]

### Added
- Added time filter in filters
- Constructor schemes: Edge editing
- Constructor schemes: Step change element z-order
- Added error message about out-of-order elements in field "_order"

### Changed
- Changed the method of requesting the status of the job from GET to POST (Version required OT simple REST 1.13.0)
- Changed "onclick" on heatmap event syntax

### Fixed
- Fixed if out-of-order elements in field "_order" in DS for singleValue, then after fix but visualisation not work
- fixed label can be moved outside node in schemes constructor
- Fixed visual bug if SingleValue set value equal 0 if exist value less then 0
- Fixed bug if change DS then slider thumb is in the wrong position
- Fixed dashed border in a corner of text block in schemes constructor
- Fixed incorrect textarea update
- Fixed graph readability
- Fixed graph alignment
- Fixed handling popup on graph
- Fixed. In the header of the component infinite loading
- fixed: graph vertex labels overlap each other
- Constructor schemes: Disabled focusing on elements

## [1.99.0]

### Added
- Added otl commands info tooltips
- Added a notification if the field specified for the default data source isn't found
- Updated the design of notifications
- Added tooltips describing OTL commands in data exploration

### Fixed
- Fixed position select
- fixed typo in svg loading field placeholder
- fixed bug with color if change metric position
- The problem with going beyond the boundaries of the "Tune" component after restarting the Data Source
- If you select the Option to select multiple values, the default value is added to the drop-down list
- The name of the token in the list of tokens disappears when navigating through the tabs
- Fixed. Unable to select property for dropdown list token

### Changed
- Changed the "Not found" page

## [1.98.1]

### Fixed
- fixed lists of users, groups, indexes empty in group editing modal

## [1.98.0]

### Added
- Added columnCount, tileStyle options on dashTile
- Added event handling on dashTile
- Upgrade yFiles to 24.0.5
- Added Constructor-schemes component
- Added loading svg

### Fixed
- Fixed error messages fo password un profile
- Fix yGraph moving issue
- fixed reportV2 height visualization
- fix filter datapicker
- Fixing versions of third-party components
- Fixed the styles of the user menu
- Fixed text color on dashTile
- When clicking on the text in the table cell, the token was not updated

## [1.97.0]

### Added
- Add password max length
- Added visualization  circular dial

### Fixed
- Change username on edit
- Multiline. Signature of the nth point
- Dash Table: when saving the settings, the checkboxes for the columns are removed
- fixed logout on reboot

## [1.96.0]

### Fixed
- Fixed delete user in profile
- Fixed datepicker visualisation
- Fixed zooming of a multiline in the Data Research 2.0
- The order of rendering lines on the multiline has also been changed
- Fixed selection the default source data in dash settings
- Fixed piechart visualisation
- Problem with data increment on request

## [1.95.0]

### Added
- Added new picker button to dash picker
- added general settings for panels.
- added the ability to hide the name of the panel.
- added the ability to update the source data by the panel icon.
- added the ability to hide the background color on panels.
- added the ability to add a download icon to the panel.
- added a setting for hiding/displaying a full-screen icon on panels.
- Added removal of restrictions
- added the ability to configure the source data for the default component value

### Fixed
- Fixed ygraph tooltip position
- Changed icons for menu, tune and accumulators visualisations 
- Fixed dashboard save edit state
- Fixed dashboard save drag/resize state
- Fixed text color in codeMirror if selected custom color theme
- Fixed drag/resize type error
- Fixed resizing UI dashes without background
- When selecting an area on the multiline, a tooltip is displayed on the barplots
- Fixed spaces around text in tokens from table
- Fixed loading bar
- Fixed the save dashboard dialog has no frame
- Updated drawing of points on multi-line lines
- Fixed fullscreen multiline

## [1.94.0]

### Added
- Add Menu visualisation
- Add icons to title actions
- Multiline: updated the settings design, added chart groups
- added legend highlight on the multiline component
- added ability to bind the Y axis in the multiline component
- Added input data validation in the textarea component 
- adding settings for the textarea
- Added transition on click to map

### Fixed
- Fixed SingleValue title tockens
- Fixed piechart legend in big size mode
- Fixed SingleValue "missing _order" error if order exist in edited data source
- Fixed username in DS request
- Fixed big size visualisation mode

## [1.93.0]

### Added
- Added data source setting for its autorun immediately after loading the dashboard
- Add pipeline parameters to map

### Fixed
- Fixed data source export
- Fixed modal windows behavior
- Fixed select number

## [1.92.0]

### Added
- Add fullscreen mode to visualosations
- Add options mode tune and accumulators visualisations
- Add title actions in settings for visualisations
- Adding layers to the map

### Fixed
- Fix accumulator colors
- Fixed metrics order in dashSingleValue.vue
- Fixed error in dashSingleValue.vue on data source changed
- Fixed title actions
- Removed old reports page 
- Removed papers page
- Remove title actions from reports visualisations
- Fixed modal visualisation console error
- Fixed modal visualisation esc error

## [1.91.0]

### Added
- Add code editor to reportsV2
- add visualisation dashAccumulators.vue

### Fixed
- Fixed dashDTPicker active element text color
- Fixed tokens in csvg visualisation
- Fixed csvg popup
- Fixed dashDTPicker active element text color
- Fixed color picker background

## [1.90.0]

### Added
- Add donat mod to pieChart
- Created gantt class
- Created piechart class
- Created graph class

### Fixed
- Multiline. Some chart line display settings do not work
- Fixed guntt infinite loop
- Fixed styles on vuetify components
- Fixed default color dashButton
- Fixed errors in old reports  
- Fixed dashSingle fullscreen mode
- Fixed dash single background color

## [1.89.0]

### Feature
- Created map class
- additional export

### Fixed
- fix export link
- fixed maps mode
- data exploration 2.0: fixed styles and added a horizontal scroll bar

## [1.88.0]

### Feature
- Added hotkey for query window in data research v2

### Fixed
- Fixed d3 select in timeline
- fixed data exploration 2.0 gantt: the date format setting for the Gantt chart does not apply
- fixed change osmserver in map settings
- fixed default osmserver and default search in dashMapUserSettings
- fixed maps tooltip
- fixed the display of histograms with negative values on a multiline dash
- the width of the histogram is now only positive

## [1.87.0]

### Added
- added new notification system
- added color picker for custom pie chart
- added nginx configuration files for /eva endpoint
- added eva router prefix

### Fixed
- Fixed dashSelect Tokens error
- fixed computer dataRestDeep in dashSelect.vue
- Data exploration 2.0: visualization improvements
- fixed piechart visual inaccuracies

## [1.86.1]

### Fixed
- Fixed theme styles

## [1.86.0]

### Added
- added visualisations in DS2 (ygraph, bush, map, heatmap, singleValue, tune)
- Added display of a message about the lack of data on the visualization "tile"
- logout form all browser tabs

### Fixed
- add settings for singleValue in reportsV2
- fixed reportsV2 heat map visualisation
- fixed and disabled eslint errors
- fixed White areas in SingleValue
- fixed modal-confirm in modal-profile and modal-create
- fixed Multiselect. Extra data from the previous request remains in the new select
- fixed Remove display of "Select Data Source" button right after creation
- fixed Incorrect list in export dashboard list
- Fixed range selection on a multiline dash
- Redrawing a dash multiline when changing the main theme
- Fixed a metric styles bug in "united" option on the dash multiline
- Fixed the text color on the Y-axis of multiline text.
- fixed reportsV2: mutate vuex store state outside mutation
- fixed the problem of cropping the axis text in full-screen multiline mode
- histograms move beyond the lines on multilines
- fixed reportsV2: display of columns from table settings does not work
- fixed reportsV2: style theme
- fixed reportsV2: old filters apply to new queries
- fixed bush. reloading Data Source
- fixed reportsV2: timeline change col
- fixed reportsV2: visualization settings not working tile
- fixed reportsV2: some visualizations are not displayed immediately after selection
- fixed a visual bug in the single value dash
- fixed reportsV2: map display, settings, styles
- fixed reportsV2: Incorrect display of the graph and non-working control buttons 
- fixed resizing movable visualisation
- fixed tune resize
- fixed updating and undoing filter parts changes
- Fixed the color of the number of lines per page.
- Fixed color and layout in the dropdown menu on the "statistics" tab.
- Fixed zoom buttons on the timeline.
- Fixed styles on v-select\v-label\v-input
- Fixed timeline zoom

## [1.85.0]

### Added
- added the ability to update tokens when executing a go event
- reportsV2 timeline get data from backend
- reportsV2 interesting get data from backend
- added visualisations to datа research 2.0.

### Fixed
- fix first search id
- fix bush drawing
- fix single value template reactivity
- fix SR2 visualisation
- fixed group edit and dash edit modal
- Multiline. Moved the barplots to the background
- fixed single value metadata and ranges if the boundaries coincide - incorrect processing
- SingleValue Color setting for indicators via the Ranges button
- Added blocking of the scheduler application button
- fixed piechart color rgb
- fixed gis settings styles
- fixed calendar in data source
- fixed creating/editing dashboards/groups
- fixed guntt disappears data when navigating through tabs
- fixed multiline tooltip display on fullscreen not working
- fixed styles theme
- fixed gis icons
- Fixed template for metrics
- fixed dashboard creation
- fixed columns in the table are not hidden
- fixed multiline settings and design improvements
- fixed additional message about existing data source when renaming
- fixed multiline label
- fixed heatmap. Transition by event to tabs.
- fixed renaming with data source replacement
- fixed passed properties to token
- fixed dashTable.vue
- fixed save dashboards
- fixed log icon light up on error
- fixed Piechart. Custom themes color set reset
- fixed gis
- fixed multiline
- fixed piechart chunk selection syncing
- fixed dashSelect
- refactoring a multiline
- Fixed persistent modal
- Added tab deletion confirmation
- Added closing confirmation by "Esc\Click-outside"
- Fixed change tracking in "modal-settings" fields
- fixed guntt hints
- fixed an empty data source will load indefinitely
- fixed activate tabs in new dashboards
- fixed dashboards\groups are not imported\exported
- fixed piechart positionlegend
- fixed data is not disaplayed after renaming data sources
- fixed create dashboard visualisation
- fixed fix color styles and ygraph tooltip
- fixed unable to create new components
- fixed dash tune
- fixed default tab are not created
- fixed multiselect refinement
- fixed multiselect placing data on multiple lines
- fixed add token 
- improvements handling window closing
- fixed dropdown lists
- fixed table columns not hiding
- fixed handling deletion of tabs
- fixed bugs in "modal-delete"

## [1.84.0]

### Added
- multiple tokens

### Fixed
- fixed filters. name and content
- fixed visible zoom button
- fixed setting the title breaks the scrolling of the component
- fixed guntt full screen improvements.
- fixed searching by bool type
- fixed fullscreen improvements tune
- fixed removed all download buttons for components

## [1.83.1]

### Fixed
- release name

## [1.83.0]

### Added
- added ability zoom all multiline graphs
- added the ability to zoom out by double-clicking on a multiline
- Added a frame for the event window

### Fixed

- fixed selecting an object after changing dash setting
- fixed token with an empty name
- fixed name restriction for tokens
- Visualization. Time selection. Parts of a component are rendered outside of the component's bounds
- fixed component checkboxes have undefined status
- fixed dash single value title
- fixed setting theme
- fixed sizing a filter
- fixed dashboard component
- fixed button hints
- fixed switching between filter types
- fixed cell size in tile visualization
- fixed missing error signal in datasource exc request
- fixed tile visualization not showing after datasource restart
- fixed dash single value settings no closes

## [1.82.0]

### Added

- ghooks lib for running ESLint in pre-commit hook

### Fixed

- added a frame for the event window
- fixed node label name in YGraph
- fixed ESLint errors and warnings
- fixed the initial position of dash
- fixed dash z index
- fixed tooltip z-index
- fixed tooltip width
- fixed token with an empty name
- fixed table events
- fixed dash single value title
- fixed rename dashboard
- fixed save table settings on change fullscreen view
- fixed filter
- fixed prevent deleting a custom theme without saving
- optimized pipeline information processing in dashMap

## [1.81.0]

### Added
- refactoring modal settings
- datа research 2.0.

## Fixed
- Fixed display of dashboard edit button

## [1.80.0]

## Added

- single value modal closes on click outside

## Fixed

- fixed render a lot of tooltips for dashMap component
- fixed a problem with displaying some multi-line bar graphs

## [1.79.0]

### Added

- added a tooltip with information when hovering over an edge in a ygraph component
- added pop-up information about a node or edge in the graph component
- add env files
- searching research v.2.0

### Fixed

- multiline graphs are not rendered without resaving the settings
- fixed the data download button in the data source
- date is displayed with zeros on the multiline
- fixed merging of multiple multiline settings
- use the width of the bar chart only if there are bar charts

## [1.78.0]

### Added

- default token "evaTknLogin" that will be replaced by current username

### Fixed

- fixed the management of custom colors of the pie component
- fixed focusing on the reset button of the filter part
- fixed the bug of dragging the graph component

## [1.77.0]

### Added

- added field for choose interval tooltips for points multiline, created settings for change color lines and choose style line

- added barplot display styles of multiline
- updated sticky header and filter

### Fixed

- fixed the fullscreen dash mode size
- fixed the position of the top menu, it was non-clickable
- fixed the z level on the boards
- fixed the zoom-out button in multiline dash
- fixed bug with settings order, correct mistakes in text

## [1.76.0]

### Added

- added filters for YGraph with save settings in storage
- added selection property in events of select component

### Fixed

- slider component fixed syncing with fullscreen
- fixed multiline barplot id

## [1.75.0]

### Added

- added redirect to dashboard with information about tabs from dash heatmap
- сombining ticks of several Y-axes

### Fixed

- fixed default names for filters and tables
- fixed the ability to drag the slider component
- settings are always above visualisations
- fixed data column selection in slider component
- fixed scrolling in the components, data, markers menu
- fixed broken line charts
- fixed a problem with changing the settings of single value component
- zoom reset btn for all multilines
- zoom reset on fullscreen
- reduced reset zoom time
- fixed filter range for points and zoom multiline

## [1.74.0]

### Added

- added the slider component
- added the ability to use tokens in filters
- the ability to use a token in the name of a part of the filter
- additional properties for hotkey ctrl+\
- ability to select strings in X-axis label
- ability to use multiline select as filter for other datasourses

### Fixed

- optimized graph component
- one zoom for all graphs in not united mode
- add details menu for not email fields
- fixed the textarea in full screen mode, changed get current value
- fixed hiding columns in tables
- multiline full screen zoom
- fixed a bug with updating the values of a newly created sub filter
- fixed the display of the slider component after the update
- fixed fullscreen mode for slider component
- fixed a problem with selecting/deselecting all items in the multiselect component
- fixed style icons for points in a map component

## [1.73.0]

### Added

- added a click token to the heatmap
- multiline refresh zoom

### Fixed

- fixed the datepicker in the dataset popup
- closing the settings popup by clicking outside the popup
- the json primitives text area has theme
- added check for length of array metrics in manual filter and fixed save filters and use in other components

## [1.72.0]

### Added

- added the choice of coordinates by clicking on the map
- added the ability to use tokens in panel names
- added a click token to the heatmap

### Fixed

- fixed grid show checkbox
- fixed open settings for Picker component, added default titles for this
- fixed update textarea with full screen textarea
- fixed default token
- ability to zoom barplot
- labels on OX axis
- fixed hiding graphics when loading data
- bug with update data search
- hide the progress bar on the heatmap if the value is empty
- fixed styles for user settings in dashMap

### Added

- added the choice of coordinates by clicking on the map
- added the ability to use tokens in panel names

## [1.71.0]

### Added

- ability to set a default value for a token if its value is not set
- hot keys ctrl+/ to automatically line break
- added switch to enable/disable opening dashboard in new window in HeatMap component
- maximum number of rows in a response is automatically limited
- default color for new group
- multiline zoom as data filter

### Changed

- the date picker component has been translated into Russian
- multiline barplot bars are now centered

### Fixed

- redesign single value from design
- problem with canceling changes in SingleValue component when we don't want to save them
- single value design bugs
- single value fixed open fullscreen
- fixed save and unsaved settings for single value
- fixed move elements for single value, updated move for burger icon
- fixed colors for metric values in SingleValue component
- bug with update state for settings single value
- bug with template of single value
- set higher z-index for active component on dashboard
- increased the height of request text in data source
- multiline captions rotation on the x-axis
- multiline incorrect drawing charts height in fullscreen mode
- fixed the focus and tooltip of the activator buttons
- fixed the problem with renaming dashboards and groups
- fixed the position of the datepicker in the pop-up of the data source
- problem with scheduler id loss after refreshing page
- fixed font weights 100, 200, 400, 500, 800
- fixed SingleValue font weights
- fixed full-screen map mode
- problem with export / import filter on dashboard

## [1.70.0]

### Added

- piechart tooltips
- select pie of piechart by legend
- ability to add an additional yAxis for multiLine component
- ability to bind metrics to the left or right yAxis for multiLine component
- ability to add some barplots and linecharts for multiLine component

### Changed

- Assigning a value to a piechart token
- DEV: added beforeEach hook in router to redirect unauthorized users

### Fixed

- unauthorized users weren't redirected to login page if they tried to open dashboard from

## [1.69.0]

### Added

- multiLine component 'isDataAlwaysShow', 'xAxisCaptionRotate' and 'barplotBarWidth' settings
- DEV: \_colors.sass file in main sass directory

### Changed

- multiLine component data-tooltip visual style
- color picker for dashboard groups

### Fixed

- changed position of plus and exim btns on visualizations
- add color to handlers for resizing
- bug with disappearing rows in tables after repeated click
- added data source name to visualizations again
- infinite loading of new datasource
- bug with visual elements drops far to the bottom of the page

## [1.68.2]

### Fixed

- bug with visual components get stuck at the top of dashboard

## [1.68.1]

### Fixed

- removed multiline changes from [CHANGELOG](CHANGELOG.md) and [RELEASENOTES](RELEASENOTES.md).

## [1.68.0]

### Added

- GIS. value mask for coordinates in map component

### Changed

- removed scroll ability with shift+wheel on tab panel
- token and operation selectors in filter part modal are disabled out of edit mode
- values in token type filter part are cleared only after switching tokens
- full screen mode for all visualizations has a persist height
- GIS. show all pipes on monitoring mode

### Fixed

- bug with infinite scroll on tab panel
- displaying all existing dashboard tokens in filter part modal
- problem with render gantt and opening in full screen mode
- correct render of several gantt diagrams in dashboard
- GIS. fix width of modes in map component
- bug with data for full screen single value

## [1.67.0]

### Added

- heatmap progress-bar for the full table cell width
- setting heatmap table cell color from 'background_color' metadata key
- heatmap progress-bar sizes set to 200 (min) x 50 px
- reverse icon status for filter parts
- go to dashboard event
- compare event for table to color rows, cells and columns

### Changed

- moved some controls of filter panel to dashboard 'edit' mode
- tabs on filter setting modal window are now hiding when only manual input is available
- max width of filter part title restricted to 250px

### Fixed

- when logged as regular user 'log out' options in dropdown menu was hidden on dashboard page
- clicking reset filter part item doesn't give any visual feedback
- 'add new filter' button are now displaying correctly
- redrawing pie chart after token changes

## [1.66.0]

### Added

- zoom in/out and fitContent control buttons in graph component
- control buttons on graph component disabled when data is loading
- overflow dots in tab panel from right and left sides of panel
- scroll without shift of tab panel
- can take token from fullscreen table

### Changed

- max width of tab is 200px

### Fixed

- bug with custom themes crushing application
- problem with data source reloading when switching tab on dashboard
- bug with gantt diagram colors and tooltips

## [1.65.0]

### Changed

- UI of filter row in filter panel
- 'token' type filter parts are sorting by the count of values in them click after "accept changes"

### Fixed

- log icon highlights after error in search
- heatmap is not updated when the value in the select is changed
- problem with disappearing graph while zooming
- problem with move elements to dashboard

## [1.64.0]

### Added

- filter panel to dashboard
- unit setting to multiline component
- submit button while editing tab name
- value styles for single value component
- theme support in map component settings

### Changed

- inability to do anything with other tabs while editing one
- log button moved back from dropdown list to header

### Fixed

- hover on first row in table
- time format on x-axis while zooming
- header height equal in main menu and dashboard
- double header after incorrect search
- dash filter styles and UI

## [1.63.0]

### Added

- tabs on dashboards
- ability to enable/disable tabs on dashboard in dash settings
- ability to pin certain visual component on all tabs
- global rbg CSS variables for theme colors (only HEX was before)
- SingleValue visualization
- data source for pipeline monitoring mode

### Fixed

- bug with dashboard without elements after tabs integrations
- bug with captions not moving while zooming on MultiLine

## [1.62.0]

### Added

- tokens for maps

### Fixed

- bugs with main header
- bugs with table component header

## [1.61.0]

### Added

- new mode for map monitoring

### Changed

- heatMapGeneral visualization component renamed to heatMap
- changed header for project and dashboards, fixed bug with header for tables

### Removed

- first heatMap visualization component and its styles

## [1.60.0]

### Added

- heatmapGeneral visualization
- heatmap visualization
- heatmap metrics aggregation
- heatmap custom x, y, data, metadata fields
- heatmap ssp aggregation in watch
- custom theme creation
- image background from theme
- custom theme editing and deleting
- theme support in graph component

### Changed

- modal for selecting current application theme

### Removed

- old color props from default themes

### Changed

- heatmapGeneral table cells border and table width
- heatmapLinear component styles and visible value

## [1.59.0]

### Added

- root component App.vue to define global css variables
- add user settings to map component (zoom step, initial zoom level)
- add legend to map component

### Changed

- new color schema for light and dark themes
- styles in all main gui components to support new color schema
- styles in all visualization components on dashboard and search&reporting

## [1.58.0]

### Added

- custom styles for layout objects on map (ex background color, text, html markup, highlighting)
- sort in table component
- add setting to show specific titles in table component

### Changed

- dashboard opens for viewing (not editable by default)
- turn off clustering in map component

## [1.57.1]

### Fixed

- version into package.json

## [1.57.0]

### Added

- component map v1

### Changed

- Jenkinsfile

## [1.56.0]

### Added

- choice visual or not visual search button for textAria component
- bush v1
- fastForward all search in dashboard (experimental)
- no visible arrow in look view mode in select component

### Fixed

- "суфикс" to "суффикс" in token dashboard

## [1.55.0]

### Added

- choice of null result: either past or zero for Table, Single, MultiLine
- btn download data in header component
- graph yfiles component

## [1.54.0]

### Added

- no visible arrow in look view mode in csv components
- custom scrollbar for Application (google Chrome)
- hide logs for not admin_all Permissions

### Deleted

- light theme

### Fixed

- fix color icons in dashboard header(color - white)
- font for application (proxima nova)

## [1.53.0]

### Removed

- graph yfiles component

## [1.52.0]

### Added

- add graph yfiles component

## [1.51.0]

### Fixed

- set asynchrony all create components. Then draw only one component per time. Then get data from rest throw web worker.

- use another array of color for annotation

- reused load file

- fix download throw event

- loose reactivity from multiline (settings don`t apply before)

- understand space in name of file in event

### Changed

- change work with component on grid table

### Added

- add cell grid for dashboards

- new plugin, whom create papers (reports) from template and give link on download and preview

- add set token in single

- new component pie chart

## [1.44.26] [newSetting]

### Adde

- put theme setting in back and check on front

## [1.43.26] [checkImpExp]

### Fixed

- add check which kind of file user want to import (groups or dashs)

## [1.43.25] [heightTabel]

### Fixed

- correct height table in reports and dashboards

## [1.43.24] [colorSelectExport]

### Fixed

- fix color of select in Export/Import component

## [1.43.23] [limitlessCheck]

### Changed

- delete limit iteration in getDataApi

## [1.42.23] [improveBarChart]

### Changed

- change bar chart component

## [1.41.23] [tooLargeLogs]

### Fixed

- cut logs until he don`t abowe 5 megabait

## [1.41.22] [oneSearchMultiSelect]

### Fixed

- set tocken function will be work only on blur event

## [1.41.21] [currentTime]

### Fixed

- fix time amd set seconds, when we choose last some time

## [1.41.20] [statisticField]

### Fixed

- fix check open/close in statistic block

## [1.41.19] [improveYAxis]

### Changed

- change caption tick of Y axis

## [1.40.19] [underlineButton]

### Changed

- change underline of Button, use text-decoration

## [1.40.18] [underlineButton]

### Added

- add underline of text in Button

## [1.39.18] [styleLineMulti]

### Changed

- style of text ticks in multiline and add zero line

## [1.38.18] [negativeValueBar]

### Added

- add negative value to bar

- check zero value

## [1.37.18] [twoMulti]

### Fixed

- fixed brush fraw on time line

## [1.37.17] [brush]

### Fixed

- add custm brush instead d3.brush

## [1.37.16] [addQuis]

### Added

- add new squar in main page to open Quis

## [1.36.16] [SNMNGC-223]

### Added

- add new event on click open

## [1.35.16] [coupleBugs]

### Fixed

- color in dark theme

- color of chart same as color in legend

- zoom change also dot label and line vertical

- infinity loop - reason in call setMetricsMulti in computed getDataRest. made throw watcher

## [1.35.15] [linesOnChart]

### Added

- add vertical line on charts

## [1.34.15] [fontButton]

### Added

- add font-size button in settings

## [1.33.15] [labelDotChart]

### Added

- set dot of "\_name_caption" and add caption

- lastdot set in settings

## [1.32.15] [selectTypeAndBorderMulti]

### Added

- select wich type of chart we need

- cut data of chart of Y axis

## [1.31.15] [invisibleSelect]

### Fixed

- fix color in light theme of Select component

## [1.31.14] [colorTheme]

### Changed

- change switch color theme

## [1.30.14] [notContainTable]

### Fixed

- fix height of table, when table don`t have footer

## [1.30.13] [addSomeColor]

### Added

- added another color to multiline

## [1.29.13] [addGridtoLinechart]

### Added

- added grid to line chart and multiline chart, but in multi in sepatated view don`t show horizon line of grid

## [1.28.13] [orderTooltip]

### Fixed

- order in tooltip should same? that in legends

## [1.28.12] [lastDot]

### Added

- last dot always visible

- caption of value for last dot

## [1.27.12] [zeroCsvg]

### Added

- add check for element, maybe it was, but later it`s desappear

## [1.27.11] [hideHeaderPanel]

### Changed

- left icon profule and save in view mode

## [1.26.11] [hideHeaderSvgTile]

### Changed

- hide header of csvg component and redraw svg

- hide header of tile component

## [1.25.11] [doesntWorkSaveDash]

### Fixed

- not send properties color to dash-profile component

## [1.25.10] [toLargeTable]

### Fixed

- removed margin of table in S&R

## [1.25.9] [brokenMultiline]

### Fixed

- fixed linechart. I`m use this.id, but should use that.id

## [1.25.8] [linechartCut]

### Changed

- border-color Table

- filed textarea equal search button

- loader of dash make fatter

## [1.24.8] [linechartCut]

### Fixed

- fix cut linechart, same error that multiline, same id of clip

## [1.24.7] [darkTheme]

### Changed

- change on dark theme

## [1.23.7] [workonSelect]

### Changed

- filtered item of list

### Added

- find row

- Select all row

## [1.22.7] [TextAreaRebranding]

### Changed

- autoheight of line textarea

- press enter to set token

## [1.21.7] [twoCsvgBug]

### Fixed

- problem with set captures to actions. They not situated in computed. They should set in watch. Example in Cavg and Tile.

- Also fix disable setting tooltip of second svg element on page. I check only " == 'csvg'", but i should use indexOf.

## [1.21.6] [cutMultiline]

### Fixed

- all about same id of clip-path in all page. I choose to add uniq id (of elements) to id. Like that - clip-multiline-3 (for example)

## [1.21.5] [styleLineChartTooltip]

### Changed

- change style of tooltip in LineChart component

## [1.20.5] [deleteSpaceInSelect]

### Changed

- change space between arrow and select in Select component

## [1.19.5] [connectionRow]

### Fixed

- use value from connection row? not from data row

## [1.19.4] [multiselectCut]

### Fixed

- cut when multiselect choise several row. Now with scroll

## [1.19.3] [zIndexUnvisibleElem]

### Fixed

- fix z-index parent when elem unvisible

## [1.19.2] [sparkSvg]

### Fixed

- fix spark svg and back sbg to default capture

## [1.19.1] [checkCsvg]

### Added

- add style to date picker element

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

- add change elements value whom have a need token after move on dashboard after event

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
