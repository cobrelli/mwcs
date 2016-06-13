angular.module('mwcs').directive('fileReader', [function () {
    return {
        scope: {
            encoding: '=?',
            results: '=?'
        },
        template: '<label class="btn btn-danger btn-file">Select file<input type="file" style="display: none;"></label>',
        link: function (scope, element) {
            element.on('change', function (event) {
                var fileReader = new FileReader();
                fileReader.onload = function (onLoadEvent) {
                    scope.$apply(function () {
                        var content = onLoadEvent.target.result.replace(/\r\n|\r/g, '\n');
                        var lines = content.split('\n');
                        var header = lines.splice(0, 1);
                        scope.results = {
                            header: header[0].split(','),
                            content: lines
                        }
                    });
                };
                fileReader.readAsText((event.srcElement || event.target).files[0], scope.encoding);
            });
        }
    }
}]);