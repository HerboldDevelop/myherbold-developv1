function floatPrecision(floatValue, precision) {
  floatValue = parseFloat(floatValue)
  if (isNaN(floatValue)) { return parseFloat('0').toFixed(precision) } else {
    const power = Math.pow(10, precision)
    floatValue = (Math.round(floatValue * power) / power).toFixed(precision)
    return floatValue.toString()
  }
}

async function getDeepl(name) {
  
 
 
   const result = await fetch('http://localhost:3000/api/hello', {
   method: 'POST',
   mode: 'no-cors',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({value: name})
 }).then(response => {return response.translate})
   .catch(error => {
     console.error(error);
     return 'Could not translate';
   });



  }
 

function fileSize(size) {
  if (size > 1024) {
    const kbSize = size / 1024
    if (kbSize > 1024) {
      const mbSize = kbSize / 1024
      return `${floatPrecision(mbSize, 2)} MB`
    }
    return `${Math.round(kbSize)} kB`
  }
  return `${size} B`
}

export { floatPrecision, fileSize, getDeepl }
