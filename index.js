let fileURL = 'file.txt';

wald();
laplace();
hurwitz(0.7);
bayesLaplace([0.5, 0.35, 0.15]);

async function getFile() {
    const res = await fetch(fileURL);
    const t = await res.text();
    return t;
}

async function wald() {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    const min = [];
    strategies.forEach(el => {
        min.push(Math.min(...el.split(' ')));
    });
    console.log('Wald criteria: ');
    console.log(`Rows min values: ${min.join(' ')}`);
    console.log(`Max lower value: ${Math.max(...min)}`);
    strategies.forEach(el => {
        if (Math.min(...el.split(' ')) === Math.max(...min)) {
            console.log(`The best strategy is ${el}`)
        }
    })
}

async function laplace() {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    let newStrategies = [];
    let sumRows = [];
    strategies.forEach(el => {
        newStrategies.push(el.split(' ').map((val) => val / strategies.length));
    });
    newStrategies.forEach(el => {
        sumRows.push(el.reduce((a, c) => a + c));
    });

    console.log('Laplace criteria: ');
    console.log(`Rows sum values: ${sumRows.join(' ')}`);
    console.log(`Max value: ${Math.max(...sumRows)}`);

    strategies.forEach(el => {
        let newValues = el.split(' ').map((val) => val / strategies.length);
        let sum = newValues.reduce((a, c) => a + c);
        if (sum === Math.max(...sumRows)) {
            console.log(`The best strategy is ${el}`);
        }
    });

}

async function hurwitz(coef) {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    let max = [];
    let min = [];
    strategies.forEach(el => {
        max.push(Math.max(...el.split(' ')));
        min.push(Math.min(...el.split(' ')));
    });
    console.log('Hurwits criteria: ');
    console.log(`Coeficient: ${coef}`);
    console.log(`The lowest values of each row: ${min.join(' ')}`);
    console.log(`The highest values of each row: ${max.join(' ')}`);
    max = max.map(el => el * (1 - coef));
    min = min.map(el => el * coef);
    let values = [];
    for (let i = 0; i < strategies.length; i++) {
        values.push(max[i] + min[i]);
    }
    console.log(`The values after calculating: ${values.join(' ')}`);
    let maxOfValue = Math.max(...values);
    strategies.forEach(el => {
        let value = (Math.max(...el.split(' ')) * (1 - coef)) + (Math.min(...el.split(' ')) * coef);
        if (value === maxOfValue) {
            console.log(`The best strategy is ${el}`);
        }
    });
}

async function bayesLaplace(probability) {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    console.log('Bayes-Laplace criteria: ');
    console.log('Formula: A11*k1 + A12*k2 + A13*k3');
    let values = [];
    strategies.forEach(el => {
        let arr = el.split(' ');
        let newVal = [];
        for (let i = 0; i < probability.length; i++) {
            newVal.push(arr[i] * probability[i]);
        }
        values.push(newVal);
    });
    values = values.map(el => el.reduce((a, c) => a + c));
    console.log(`The values after calculating by formula: ${values.join(' ')}`);

    strategies.forEach(el => {
        let newVal = [];
        for (let i = 0; i < probability.length; i++) {
            newVal.push(el.split(' ')[i] * probability[i]);
        }
        let max = newVal.reduce((a, c) => a + c);
        if (max === Math.max(...values)) {
            console.log(`The best strategy is ${el}`);
        }
    })
}

