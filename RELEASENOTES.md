# [1.77.0] - Barplot display styles of multiline, sticky header and bugfixes.

### New

- Added barplot display styles of multiline.
- Updated sticky header and filter.

### Bugfix

- Fullscreen dash mode size.
- Position of the top menu, it was non-clickable.
- z-index on the boards.
- Zoom-out button in multiline dash.
- Reordered visualization settings.
- Corrected mistakes in texts.

# [1.76.0] - Filters for YGraph componet, selection property in events of select component and bugfixes.

### New

- Filters for YGraph with save settings in storage.
- Selection property in events of select component.

### Bugfix

- Slider component fixed syncing with fullscreen.
- Fixed multiline barplot id.

# [1.75.0] - Redirect to a specific dashboard tab from heatmap, ticks of several Y-axes are combined on multiline and bugfixes.

### New

- Redirect to a specific dashboard tab from heatmap.
- Combining ticks of several Y-axes.

### Bugfix

- Fixed default names for filters and tables.
- Fixed the ability to drag the slider component.
- Settings are always above visualisations.
- Fixed data column selection in slider component.
- Fixed scrolling in the components, data, markers menu.
- Fixed broken line charts.
- Fixed a problem with changing the settings of single value component.
- Zoom reset btn for all multilines.
- Zoom reset on fullscreen.
- Reduced reset zoom time.
- Fixed filter range for points and zoom multiline.

# [1.74.0] - New slider vizualization, tokens in filters and bugfixes.

### New

- Brand new slider vizualization.
- Ability to use a token in the name of filter part.
- Additional properties for hotkey ctrl+\ .
- Ability to select strings in X-axis label.
- Ability to use multiline select as filter for other datasourses.

### Bugfix

- Optimized graph component performance.
- One zoom for all graphs in seperate mode.
- Details menu for not email fields.
- Fixed the textarea in full screen mode, changed get current value.
- Fixed hiding columns in tables.
- Multiline full screen zoom.
- Fixed a bug with updating the values of a newly created sub filter.
- Fixed the display of the slider component after the update.
- Fixed fullscreen mode for slider component.
- Fixed a problem with selecting/unselecting all items in the multiselect component.

# [1.73.0] - Click token for heatmap component, multiline zoom refresh and bugfixes.

### New

- Click token for heatmap component.
- Multiline zoom refresh.
- Closing the settings popup by clicking outside the popup.

### Bugfix

- Fixed the datepicker in the dataset popup.
- Fixed filter range for points and zoom multiline.
- Theme in json primitives text area.
- Added check for length of array metrics in manual filter and fixed save filters and use in other components.

# [1.72.0] - Tokens in visualization titles, coordination choice in map component and bugfixes.

### New

- Choice of coordinates by clicking on the map.
- Tokens can be used in visualization titles.

### Bugfix

- Grid show checkbox on dashboard.
- Fixed open settings for Picker component, added default titles.
- Full screen textarea.
- Default token value.
- Ability to zoom barplot.
- Labels on OX axis.
- Fixed hiding graphics when loading data.
- Bug with update data search.
- Hide the progress bar on the heatmap if the value is empty.
- SingleValue render metrics when changed data for dashboards.

# [1.71.0] - Default token values. Search rows limitation, shortcut for line break. New font in SingeValue. A lot of bugfixes.

### New

- Ability to set a default token value for if its value isn't set.
- Ctrl+/ hot keys to automatically line break in dashboard data sources and "Searching and Reporting".
- Added switch to enable/disable opening dashboard in new window in HeatMap component.
- Maximum number of rows in response data is automatically limited to 1000 in "Searching and Reporting" and can be limited in dashboard searches too.
- DatePicker component has been translated into russian.
- Multiline barplot bars are now centered.
- Redesigned single value from design template.
- Added font weights 100, 200, 400, 500, 800 for SingeValues component.

### Bugfix

- Set default color for a new dashboard group.
- Problem with canceling changes in SingleValue component when we don't want to save them.
- Fullscreen mode of SingleValue component.
- Issue with movable elements in SingeValue settings, updated move for burger icon.
- Fixed colors for metric values in SingleValue component.
- Bug with template selection in SingleValue component settings.
- Active component on dashboard now has higher z-index.
- Increased the height of request text in data source modal windows.
- Multiline captions rotation on the x-axis.
- Multiline incorrect drawing charts height in fullscreen mode.
- Problem with tooltips not disappearing after clicking buttons.
- Problem with renaming dashboards and groups.
- Problem with position of the datepicker in the pop-up of the data source.
- Problem with scheduler id loss after refreshing page.
- Fullscreen mode of Map component.

# [1.70.0] - PieChart tooltips, new MultiLine settings including bar appearance for lines

### New

- Tooltips for PieChart visualization.
- Ability to select pies in PieChart by clicking legend.
- Ability to add additional yAxis for MultiLine component.
- Ability to bind metrics to the left or right yAxis for MultiLine component.
- Ability to change line appearance to BarPlot on MultiLine.
- Assigning a value to a PieChart token.

### Bugfix

- Unauthorized users weren't redirected to login page if they tried to open dashboard url.

# [1.69.0] - New multiline settings and tooltip changes, color picker for groups and bugfixes

### New

- Added new settings to multiLine component: 'isDataAlwaysShow', 'xAxisCaptionRotate' and 'barplotBarWidth'.
- Changed multiLine component data-tooltip visual style.
- Color picker for dashboard groups now contains preset colors from theme, and also you can create a custom one.

### Bugfix

- Plus and exim buttons are now displaying correctly while on groups/dashboards selection page.
- Resize handles are back visible while resizing components on dashboard.
- Rows in tables doesn't disappear anymore while clicking them.
- Added data source name to header of visualizations again.
- Infinite loading of created datasource in datasource panel.
- Bug with visual elements drops far to the bottom of the page.

# [1.68.2] - Hotfix of critical dashboard bug

### Bugfix

- Bug with visual components get stuck at the top of dashboard.

# [1.68.1] - RELEASENOTES and CHANGELOG fix

### Bugfix

- Removed multiline changes from [CHANGELOG](CHANGELOG.md) and [RELEASENOTES](RELEASENOTES.md).

# [1.68.0] - GIS value mask and monitoring mode changes. Visualization fixes and full screen adaptation. Minor bugfixes.

### New

- GIS. Added value mask for coordinates in map component.
- GIS. All pipes are showing in monitoring mode.
- Removed scroll ability with shift+wheel on tab panel.
- Token and operation selectors in filter part modal are disabled out of edit mode.
- Values in token type filter part are cleared only after switching tokens.
- Full screen mode for all visualizations has a persist height.

### Bugfix

- Infinite scroll on tab panel.
- Displaying all existing dashboard tokens in filter part modal.
- Problem with render gantt and opening in full screen mode.
- Correct render of several gantt diagrams in dashboard.
- GIS. Fix width of modes in map component.

# [1.67.0] - New events, UI visual and interaction changes/fixes

### New

- Heatmap progress-bar are now displayed in full cell width and minor styling changes.
- Reversed filter parts are now indicated with reverse logo.
- 'Go to dashboard' event.
- Compare event to color rows, columns and cells for table visualization component.
- Certain controls on filter panel are available only in dashboard edit mode.
- Max width of filter part title is restricted to 250px.

### Bugfix

- When logged as regular user 'log out' options in dropdown menu was hidden on dashboard page.
- Clicking reset filter part item doesn't give any visual feedback.
- 'Add new filter' button are now displaying correctly.
- Pie chart redraws correctly after token change.
- Tabs in filter modal are shown only when both modes are available.

# [1.66.0] - UI controls for graph component, tabs UI changes and bugfixes

### New

- New controls in graph component: zoom in/out and fitContent control buttons
- Overflow dots in tab panel from right and left sides of panel
- Scroll without shift of tab panel
- Can take token from fullscreen table
- Max width of tab is 200px

### Bugfix

- Custom themes now not crushing application
- Data source not reloading when switching tab on dashboard
- Correct colors and tooltips in gant diagram

# [1.65.0] - Filter UI changes, filter parts order and bugfixes

### New

- Minor changes of filter row UI in filter panel.
- 'token' type filter parts are sorting by the count of values by clicking "accept changes" now.

### Bugfix

- Log icon in header of page highlights after error in search.
- Heatmap updates properly when the value in the select (token) is changed.
- Graph doesn't disappear anymore while zooming.

# [1.64.0] - Introducing filters on dashboards, units on multiline, styles for SingleValue and other changes/fixes

### New

- Added global filters for searches on dashboards all over tabs.
- Added units for each line on MultiLine component (only for separate mode).
- Submit button while editing tab name.
- Values styles for SingleValue component.
- Theme support for user settings in map component.
- You can not switch/delete other tabs while editing name of one anymore.
- The log button is returned to the page header.

### Bugfix

- Hover on first row in table doesn't hide it anymore.
- Time format doesn't change while zooming on MultiLine component.
- Header height is equal on all pages.
- Second header doesn't appear after incorrect search anymore.

# [1.63.0] - Tabs on dashboards, new SingleValue component, GIS monitoring mode and minor bug fix

### New

- Added tabs on dashboards.
- Added ability to pin certain visual component to all tabs.
- Added upgraded SingleValue component with new layouts.
- Added data source for pipeline monitoring mode.

### Bugfix

- Fixed bug with captions not moving while zooming on MultiLine.

# [1.62.0] - GIS map tokens and few bugfixes

### New

New functionality to receive zoom level and map borders with GIS plugin.

### Bugfix

We have fixed a couple of bugs: the main header looks good, and the table header do not overlap anything.