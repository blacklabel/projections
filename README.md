
# Projections - Highcharts-3D module


The plugin gives user a chance for adding perspective points and connection lines for scatter series in 3D. 

With Projections plugin scatter points are projected into three basic planes - XY, YZ and ZX. This is giving a chance for better visaulisation of connections between x,y and z variables.


### Requirements

* Plugin requires latest Highcharts (5.0.3+)
* Plugin requires latest Highcharts 3D module (5.0.3+)

### Versions

* 1.x - Initial version of Projections.js.

### Installation

* Like any other Highcharts module (e.g. exporting), add `<script>` tag pointing to `projections.js` below Highcharts script tag.

* For NPM users:
```
var Highcharts = require('highcharts');
    require('projections')(Highcharts);
```

* For BOWER users:
```
bower install highcharts-projections
```

### Code

The latest code is available on github: [https://github.com/blacklabel/projections](https://github.com/blacklabel/projections)

### Usage and demos
```
    series: [{
      planeProjection: {
        enabled: true,
        fill: 'red',
        radius: 10,
        'stroke-width': 3
      },
      lineProjection: {
        enabled: true,
        colorByPoint: true,
        dashStyle: 'dot',
        zIndex: 2,
        'stroke-width': 3
      },
      data: [{
        x: 7,
        y: 5,
        z: 5,
      }, {
        x: 5,
        y: 5,
        z: 5,
      }, {
        x: 7.5,
        y: 5,
        z: 5,
      }]
    }]

```

### Parameters
| Property | Type | Ddescription |
| --- | --- | --- |
| | | |
| planeProjection | | |
| enabled | Boolean | Information if projections should be enabled, disabled or enabled on hover |
| fill | String | Fill color of projections |
| byPoint | Boolean | Information if radius and color should be taken from point or global options |
| radius | Number | Projections radius |
| stroke-width | Number | The width of stroke in projections |
| | | |
| lineProjection | | |
| enabled | Boolean | Information if projections should be enabled, disabled or enabled on hover |
| dashstyle | String | Dash style of line projection |
| zIndex | Number | z-index of line projection |
| stroke | String | Color of projections line |
| stroke-width | Number | The width of stroke in line projections |

