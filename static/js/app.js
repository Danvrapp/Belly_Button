// Define variables for label

var age;
var bType = "";
var ethnicity = "";
var gender = "";
var loc = "";
var wFreq = "";
var samNum;

//Create array of dictionaries to ID data
var dataArray = [{
  Header:"Age:",
  Value:""
},
{
  Header:"BBType:",
  Value:""
},
{
  Header:"Ethnicity:",
  Value:""
},
{
  Header:"gender:",
  Value:""
},
{
  Header:"Location:",
  Value:""
},
{
  Header:"WFreq:",
  Value:""
},
{
  Header:"Sample #:",
  Value:""
}];
function buildMetadata(sample) {
  var sampleNumber = d3.select("#sample-metadata");

  // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`metadata/${sample}`).then(function(data) {
    //Store metadata into appropriate dictionary
    dataArray[0].Value = data.AGE;
    dataArray[1].Value = data.BBTYPE;
    dataArray[2].Value = data.ETHNICITY;
    dataArray[3].Value = data.GENDER;
    dataArray[4].Value = data.LOCATION;
    dataArray[5].Value = data.WFREQ;
    dataArray[6].Value = data.sample;
    console.log("dataArray:", dataArray);

    //Build lable on HTML page
    d3.select("tbody")
      .html("")
      .selectAll("td")
      .data(dataArray)
      .enter()
      .append("tr")
      .html(function(d) {
        return `<td>${d.Header}</td><td>${d.Value}</td>`;
    })
  });
}

function buildCharts(sample) {

  var URL = "/samples";
  d3.json(`${URL}/${sample}`).then(function(data) {
     // Get top 10 bacteria from the sample
     var topTenIDs = data.otu_ids.slice(0, 10);
     var topTenLabels = data.otu_labels.slice(0, 10);
     var topTenValues = data.sample_values.slice(0, 10);
     //Set up type of chart
     var trace1 = {
      labels: topTenIDs,
      values: topTenValues,
      hoverinfo: topTenLabels,
      type: "pie"
    };
    
    var data = [trace1];
    
    var layout = {
      title: "% of 10 most present bacteria type",
    };
    // Create pie chart
    Plotly.newPlot("pie", data, layout);
  });

    d3.json(`${URL}/${sample}`).then(function(data) {
      const IDs = data.otu_ids;
      const Labels = data.otu_labels;
      const Values = data.sample_values;

      // Set up bubble chart
      var trace1 = {
       x: IDs,
       y: Values,
       marker: {
         size:Values,
         sizeref: 1.5,
         color: IDs
       },
       mode: 'markers'
     };
     
     var data = [trace1];
     
     var layout = {
       title: "OTU vs. Sample count",
     };
 
     Plotly.newPlot("bubble", data, layout);
   }); 
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
