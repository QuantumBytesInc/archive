function HttpProvider ($httpProvider) {
$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
$httpProvider.defaults.xsrfCookieName = 'csrftoken';
$httpProvider.defaults.headers.common['X-CSRFToken'] = $("[name='csrfmiddlewaretoken']").val();
}
