var React = require('react');
var Component = React.Component;
var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var List = require("collections/list");

var dataPoints =[];
class App extends Component {

    // Declare title, X and Y axis
    render() {
        const options = {
            theme: "light2",
            title: {
                text: "Nombre de phénomènes aérospatiaux non identifiés par an"
            },
            axisY: {
                title: "Nombre d'observations",
                prefix: "$",
                includeZero: false
            },
            data: [{
                type: "line",
                xValueFormatString: "YYYY",
                yValueFormatString: "$#,##0.00",
                dataPoints: dataPoints
            }]
        }
        return (
            <div>
                <CanvasJSChart options = {options}
                               onRef={ref => this.chart = ref}
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }

    componentDidMount(){
        var chart = this.chart;

        // Before fetch data, need to convert CSV file to json
        const csvToJson = require('convert-csv-to-json');

        const fileCsv = 'data/cas_pub.csv';
        const fileJson = 'cas_pub.json';
        csvToJson.generateJsonFileFromCsv(fileCsv, fileJson);

        fetch(fileJson)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // First we count number of case per years
                var CalculatedData = new List([0 ,0]);
                var years = 0;
                var j = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].cas_AAAA == CalculatedData[j,0]) {
                        CalculatedData[j,1] += 1;
                    } else {
                        CalculatedData[j,0] = data[i].cas_AAAA;
                        j++;
                    }
                }

                for (var i = 0; i < CalculatedData.length; i++) {
                    dataPoints.push({
                        x: CalculatedData[i,0],
                        y: CalculatedData[i,1]
                    });
                }
                chart.render();
            });
    }


}

module.exports = App;