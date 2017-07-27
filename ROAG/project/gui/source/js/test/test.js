describe('Controllers: HomeCtrl', function () {
    var uiCommunicate, scope;
    beforeEach(inject(function ($rootScope, $controller,__uiCommunicate__)
    {
        scope = $rootScope.$new();
        uiCommunicate = __uiCommunicate__;
    }));

    it('should set a page titlasdfe', function () {
        expect("test").toEqual("blaa");
        expect(uiCommunicate).toEqual(true);
          //console.log(uiCommunicate.callWeb);
    });
});