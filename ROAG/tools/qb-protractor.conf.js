exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    specs: ['/srv/gui_data/media/test/protractor/test.js'],
    capabilities: {
        'browserName': 'chrome'

    }

}