var React = require('react');
var Component = React.Component;
var List = require("collections/list");

var dataPoints =[];
class ChartGraph extends Component {

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
                <canvas options = {options}
                               onRef={ref => this.chart = ref}
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }

    componentDidMount(){
        var chart = this.chart;

        fetch('Data.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // First we count number of case per years
                var CalculatedData = new List([0 ,0]);
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


export default ChartGraph;