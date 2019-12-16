let inputSequences = "";
window.onload = function() {
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", function(e) {
    const file = fileInput.files[0];
    const textType = /text.*/;
      let reader = new FileReader();
      reader.onload = function(e) {
        inputSequences = reader.result;
      };
      reader.readAsText(file);
  });
};
const returnSequencesAndLabels = () => {
  const patterns = {
    lineBreaks: /(\r\n)+|\r+|\n+|\t+/i,
    anySpacesOrBreaks: /\r?\n\s|\r\s|\s/g,
    spacesAround: /\r?\n|\r/g
  };
  const mixedData = inputSequences.toLowerCase().split(">");
  mixedData.shift();
  const onlySequences = mixedData.map(sequence =>
    sequence
      .slice(sequence.search(patterns.lineBreaks))
      .replace(patterns.anySpacesOrBreaks, "")
  );
  const onlyLabels = mixedData.map(label =>
    label.substring(0, label.search(patterns.spacesAround)).trim()
  );
  const sequencesAndLabels = {
    sequences: onlySequences,
    labels: onlyLabels
  };
  return sequencesAndLabels;
};
const returnATPercent = (sequence, startPosition, windowWidth) => {
  // calculating average AT % for given windowWidth starting from startPosition
  let countAT = 0;
  for (let i = startPosition; i < startPosition + windowWidth; i++) {
    const letterAOrT = sequence[i] === "a" || sequence[i] === "t";
    if (letterAOrT) {
      countAT++;
    }
  }
  return (countAT / windowWidth) * 100;
};
const returnXs = (sequence, windowWidth, step) => {
  // creating array of positions for given sequence (X axis values)
  const positions = [];
  const lastWindowPosition = sequence.length - windowWidth;
  for (
    let position = 0;
    position < lastWindowPosition;
    position += step /* <---???? */
  ) {
    positions.push(position);
  }
  const notFullyCovered =
    positions[positions.length - 1] + windowWidth < sequence.length;
  if (notFullyCovered) {
    positions.push(lastWindowPosition);
  }
  return positions;
};

const returnYs = (positions, sequence, windowWidth) => {
  // creating array of AT% for each windowWidth for given sequence (Y axis values)
  const atPercentArray = positions.map(position =>
    returnATPercent(sequence, position, windowWidth)
  );
  return atPercentArray;
};
const returnPlotDatasets = (labels, sequences, windowWidth, step) => {
  // creating datasets for plot rendering
  const multipleXYDatasets = [];
  for (const [seqIndex, sequence] of sequences.entries()) {
    const xValues = returnXs(sequence, windowWidth, step);
    const yValues = returnYs(xValues, sequence, windowWidth);
    multipleXYDatasets.push(
      trace = {
        x: xValues,
        y: yValues,
        type: "scatter",
        name: labels[seqIndex],
        mode: "lines+markers"
      });
  }
  return multipleXYDatasets;
};
const calcAll = () => {
    const fileValue = document.forms["AT-form"]["file"].value
    const rangeValue = document.forms["AT-form"]["range"].value
    const stepValue = document.forms["AT-form"]["step"].value
    if (fileValue == "") {
        alert("Please upload a file");
    } else if (rangeValue <= 0) {
        alert("minimal range value is 1");
    } else if (stepValue <= 0) {
        alert("minimal step value is 1");
    } else {
        const windowWidth = Number(document.getElementById("range").value);
        const step = Number(document.getElementById("step").value)
        const {labels, sequences} = returnSequencesAndLabels();
        const datasets = returnPlotDatasets(labels, sequences, windowWidth, step);
        const layout = {
            title: 'AT content',
            xaxis: {
                title: 'Position of range beginning [bp]',
            },
            yaxis: {
                title: 'AT content [%]',
            }
        };
        let isPlotlyDone = false;
        const plotDiv = document.getElementById('plot-area')
        if(!isPlotlyDone){
            plotDiv.innerHTML='';
        }
        Plotly.plot(plotDiv, datasets, layout).then(function() {
            isPlotlyDone = true;
        });
        Plotly.newPlot('plot-area', datasets, layout);
    }
}


