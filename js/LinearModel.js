function score(input) {
    return ((((((8.84490118751027) + ((input[0]) * (-0.007933358183950256))) + ((input[1]) * (-7.190663618365594e-05))) + ((input[2]) * (0.1536949923707923))) + ((input[3]) * (-0.09508298688375617))) + ((input[4]) * (0.0032087293207770096))) + ((input[5]) * (-0.023356101081126412));
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn').addEventListener('click', function () {
        // class="input-box"の要素を全て抽出
        let features = document.getElementsByClassName('input-box');
        let data = [];
        // 一個ずつdataに格納
        for (let i = 0; i < features.length; i++) {
            data.push(Number(features[i].value));
        }

        console.log(data);
        
        // 結果は対数を取ったものなので小さくなっている
        let log_pred = score(data);
        // e^xをすることで元の値に戻す
        let pred = Math.exp(log_pred);

        console.log(pred);

        // <div id="output">に結果を表示させる
        let output = document.getElementById('output');
        output.textContent = pred;
    });
});