
function draw() {
$(document).ready(function() { 
d3.csv("static/data/nodes.csv", function(error, links) { 

var nodes = {}; 

links.forEach(function(link) { 
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = 960, 
    height = 500;

var force = d3.layout.force() 
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(150) 
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("#build_graph").append("svg")
    .attr("width", width)
    .attr("height", height);


svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("g").selectAll("path") 
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
    .attr("id", function(d) { return "path" + d.id; }); 


$.each(force.links(), function( index, value ) { 
  var text_link = svg.append("text")
    .attr("x", 30)
    .attr("y", ".5em");

	text_link.append("textPath")
		.attr("xlink:href", "#path" + value.id)
		.text(value.label);
});


var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
  .enter().append("circle")
    .attr("r", 6)
    .call(force.drag);


var text = svg.append("g").selectAll("text")
    .data(force.nodes())
  .enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });



function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
}

function linkArc(d) { 
  var x1 = d.source.x,
      y1 = d.source.y,
      x2 = d.target.x,
      y2 = d.target.y,
      dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy),

      drx = dr,
      dry = dr,
      xRotation = 0, 
      largeArc = 0,
      sweep = 1;

      if ( x1 === x2 && y1 === y2 ) {
        xRotation = 50; 

        largeArc = 1;
        drx = 15;
        dry = 15;

        x2 = x2 + 1;
        y2 = y2 + 1;
      } 

 return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2; 
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}
});
});
};



var g_MatrixSize = 3; 

function PackMatrix() 
{
    var matrix = "";
    
    for (i = 0; i < g_MatrixSize; i++)
    {
        for (j = 0; j < g_MatrixSize; j++)
        {
            var element = document.getElementsByName("field" + i + j)[0];
            matrix = matrix + (element.value.length > 0 ? element.value : "0") + ", ";
        }
        matrix = matrix + "\n";
    }
	console.log(matrix);
    return matrix;
}

function CopyMatrixToTextInput() 
{
    document.getElementById("AdjacencyMatrixFieldPage").value = PackMatrix(); 
}


function CopyMatrixToMatrixInput()
{
    var graph = new Graph();
    
    var colsObj = {};
    var rowsObj = {};
    

    if (graph.TestAdjacencyMatrix($( "#AdjacencyMatrixFieldPage" ).val(), rowsObj, colsObj))
    {
        var rows = rowsObj.rows;
        var cols = colsObj.cols;
        
        for (var i = g_MatrixSize; i < rows.length; i++)
        {
            IncSize();
        }
        
        for (var i = 0; i < rows.length; i++)
        {
            for (var j = 0; j < rows.length; j++)
            {
                var element = document.getElementsByName("field" + i + j)[0];
                element.value = cols[i][j];
            }
        }
    }
    else
    {
        ShowTextInput();
    }
}

function CreateInputElement(col, row) 
{
    var input = document.createElement("input");
    input.type = "text";
    input.size = 3;
    input.name = "field" + col + row;
    input.value = 0;
    input.onkeyup = function() {CopyMatrixToTextInput();};
    
    return input;
}

function InsertBeforeElement(element, beforeName, space)
{
    var parent = document.getElementsByName(beforeName)[0].parentNode;
    var beforeElement = document.getElementsByName(beforeName)[0];
    parent.insertBefore(element, beforeElement);
    
    if (space)
    {

        parent.insertBefore(document.createTextNode( '\u00A0' ), beforeElement);
    }
}

function IncSize() 
{
    for (var i = 0; i < g_MatrixSize; i ++)
    {
        var input = CreateInputElement(g_MatrixSize, i);
        InsertBeforeElement(input, "matrixEnd", true);
    }
    var br = document.createElement("br");
    br.setAttribute("name", "row" + g_MatrixSize);
    InsertBeforeElement(br, "matrixEnd", false);
    
    for (var i = 0; i < g_MatrixSize + 1; i ++)
    {
        var input = CreateInputElement(i, g_MatrixSize);
        InsertBeforeElement(input, "row" + i, g_MatrixSize);
    }
    g_MatrixSize++;
    CopyMatrixToTextInput();
}

function checkFormat()
{
    var graph = new Graph();
    var separator = $("#spaceSep").is(':checked') ? " " : ",";
    
    if (!graph.TestAdjacencyMatrix($( "#AdjacencyMatrixFieldPage" ).val(), [], [], separator))
    {
        $( "#BadFormatMessage" ).show();
    }
    else
    {
        $( "#BadFormatMessage" ).hide();
    }
}

window.onload = function ()
{
    
	if (document.getElementById('CreateByAdjacencyMatrix'))
	{
		
		
			$(function() {
			  $('#CreateByAdjacencyMatrix').bind('click', function() {
				$("svg").remove();
				$.getJSON('/background_process', {
				  proglang: PackMatrix(), 
				}, function(data) { 
					
                    draw();
					
				});
				return false;
			  });
			});
			
    }


	$( "#AdjacencyMatrixFieldPage" ).on('keyup change', function (eventObject)
		{
            checkFormat();
		});

		$( "#BadFormatMessage" ).hide();
        $( "#AdjacencyMatrixFieldPage" ).hide();
    
    $('input:radio[name="separator"]').change( function(){
                                                checkFormat()
                                            });
    
    CopyMatrixToMatrixInput();
	
}
