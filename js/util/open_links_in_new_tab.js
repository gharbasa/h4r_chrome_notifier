$(function () {

  $(document).on('mouseover', 'a', function (e) {
    $(e.currentTarget).attr('target', '_blank');
  });

});
