'use strict';

describe('Filter: link', function () {

  // load the filter's module
  beforeEach(module('interviewer'));

  // initialize a new instance of the filter before each test
  var link;
  beforeEach(inject(function ($filter) {
    link = $filter('link');
  }));

  it('should return the correct percentage view of the number', function () {
    expect(link('Please follow this link https://google.com/')).toBe('Please follow this link <a href="https://google.com/">https://google.com/</a>');
    expect(link('http://localhost/#/session/a18d6816-efcb-4cf2-b1b7-294bef69bfdf/')).toBe('<a href="http://localhost/#/session/a18d6816-efcb-4cf2-b1b7-294bef69bfdf/">http://localhost/#/session/a18d6816-efcb-4cf2-b1b7-294bef69bfdf/</a>');
  });
});
