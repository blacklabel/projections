
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
<table>
  <thead>
    <tr>
      <th align="left">Property</th>
      <th align="left">Type</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>planeProjection</td></tr>
    <tr><td align="left">enabled</td><td>Boolean/String</td><td align="left">Information if projections should be enabled, disabled or enabled on hover</td></tr>
    <tr><td align="left">fill</td><td>String</td><td align="left">Fill color of projections</td></tr>
    <tr><td align="left">byPoint</td><td>Boolean</td><td align="left">Information if radius and color should be taken from point or global options</td></tr>
    <tr><td align="left">radius</td><td>Number</td><td align="left">Projections radius</td></tr>
    <tr><td align="left">stroke-width</td><td>Number</td><td align="left">The width of stroke in projections</td></tr>

    <tr><td>lineProjection</td></tr>
    <tr><td align="left">enabled</td><td>Boolean/String</td><td align="left">Information if projections should be enabled, disabled or enabled on hover</td></tr>
    <tr><td align="left">dashstyle</td><td>String</td><td align="left">Dash style of line projection</td></tr>
    <tr><td align="left">zIndex</td><td>Number</td><td align="left">z-index of line projection</td></tr>
    <tr><td align="left">stroke</td><td>String</td><td align="left">Color of projections line</td></tr>
    <tr><td align="left">stroke-width</td><td>Number</td><td align="left">The width of stroke in line projections</td></tr>
  </tbody>
</table>


