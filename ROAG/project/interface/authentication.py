from rest_framework.authentication import SessionAuthentication, TokenAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class CsrfExemptTokenAuthentication(TokenAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening