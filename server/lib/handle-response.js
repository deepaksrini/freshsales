function handleResponse(err, resp) {
  if (!err && resp.statusCode === 200) {
    console.log(JSON.stringify({
      status: resp.statusCode,
      message: 'success'
    }));
  }
}
function  fnPostResponse(url, jsondata) {
  $request.post(url, {
    headers : {
      'Authorization' : 'Bearer <%= access_token %>',
      'Content-Type': 'application/json'
    },
    isOAuth : true,
    formData: jsondata
  })

  .then(function(data)  {
    console.log('Successfully created task' + JSON.stringify(data));
  });
}
exports = {
  handleResponse: handleResponse,
  fnPostResponse:fnPostResponse
};