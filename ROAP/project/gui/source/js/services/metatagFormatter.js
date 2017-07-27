function MetatagFormatter($rootScope){

  return {
    format : format
  };

  /*
    @method format
    @param {String} text
    @return {String} Returns
      trimmed,
      character limited (153),
      linebreak free (\r \n \r\n),
      html tag free Text
  */
  function format(text){
    var maxChars = 153;
    var append = "...";
    text = text.replace(/&nbsp;/g," "); //
    text = $(text).text();
    text = text.replace(/(\r\n|\n|\r)/gm,"");
    if(text.length <= 156)  append = " ";
    text = text.substr(0, maxChars) + append;
    text = $.trim(text);
    return text;
  }

}
