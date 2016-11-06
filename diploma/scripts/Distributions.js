(function () {
    //Box–Muller method
    Math.randomGaussian = function (mean, standardDeviation) {

        if (Math.randomGaussian.nextGaussian !== undefined) {
            var nextGaussian = Math.randomGaussian.nextGaussian;
            delete Math.randomGaussian.nextGaussian;
            return (nextGaussian * standardDeviation) + mean;
        } else {
            var v1, v2, s, multiplier;
            do {
                v1 = 2 * Math.random() - 1;
                v2 = 2 * Math.random() - 1;
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s == 0);
            multiplier = Math.sqrt(-2 * Math.log(s) / s);
            Math.randomGaussian.nextGaussian = v2 * multiplier;
            return (v1 * multiplier * standardDeviation) + mean;
        }

    };

    Math.randomUniform = function (a, b) {
        return a + Math.random() * (b - a) / 5;
    }

    Math.randomExponential = function (lambda) {
        return 10 * (-1 * Math.log(Math.random()) / lambda);
    }

})();