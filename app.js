// const today = new Date();
// const y = today.getFullYear();
// const m = today.getMonth();
// const start = new Date(y, m, 1).toISOString();
// const end = new Date(y, m + 1, 0).toISOString();

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}


fetch('https://dashboard.elering.ee/api/nps/price?start=2020-05-31T20%3A59%3A59.999Z&end=2020-06-30T20%3A59%3A59.999Z')
    .then(response => response.json())
    .then(data1 => {

        const dataee = data1.data.ee;
        const price = [];
        const date = [];

        const test = dataee.map(el => {
            el.timestamp = new Date(el.timestamp * 1000).getDate()
            return el
        })
        const grouped = groupBy(test, day => day.timestamp)

        const average = []
        grouped.forEach((item) => {
            // console.log(item)
            const averagePrice = (item.map((element) => element.price).reduce((acc, value) => acc + value) / item.length).toFixed(2)
            average.push({
                'day': item[0].timestamp,
                'price': averagePrice
            })
        })
        console.log(average)



        // dataee.forEach((element) => {

        //     const stamp = new Date(element.timestamp * 1000);
        //     const day = stamp.getMonth();
        //     price.push(element.price);
        //     date.push(day);
        // });

        // const date = new Date(time);
        // console.log(stamp);

        const labels = average.map((label) => label.day);

        const ctx = document.getElementById('chart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Energia päevahind',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: average.map((element) => element.price)
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });


    })
    .catch((error) => {
        console.error('Error:', error);
    });
