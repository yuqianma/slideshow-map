
export default function(callback, delay) {
  var timeout;

  return function() {
    var context = this,
      args = arguments;

    clearTimeout(timeout);

    timeout = setTimeout(function() {
      callback.apply(context, args);
    }, delay);
  };
}
