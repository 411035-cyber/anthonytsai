







// 替換成你部署 GAS 後取得的網頁應用程式 URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyWZ2mrZ92W-8KwYLvvlrMPNpGwx-rZ6DOssQg3FQHoXwSSPskPTPN9PB7T2jU5_8Lp4w/exec'; 

document.getElementById('fetchApiBtn').addEventListener('click', async () => {
    const id = document.getElementById('questionId').value;
    if (!id) {
        alert("請先輸入題目編號！");
        return;
    }

    const titleInput = document.getElementById('questionTitle');
    titleInput.value = "讀取中...";

    try {
        // 使用公開的測試 API 模擬抓取題目資訊
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        const data = await response.json();
        
        if(Object.keys(data).length === 0) {
            titleInput.value = "找不到該題目";
        } else {
            // 將 API 回傳的資料填入欄位
            titleInput.value = data.title;
        }
    } catch (error) {
        titleInput.value = "API 呼叫失敗";
        console.error("Error:", error);
    }
});

document.getElementById('submitBtn').addEventListener('click', async () => {
    const id = document.getElementById('questionId').value;
    const title = document.getElementById('questionTitle').value;
    const difficulty = document.getElementById('difficulty').value;
    const notes = document.getElementById('notes').value;
    const statusMsg = document.getElementById('statusMsg');

    if (!title || title === "讀取中..." || title === "找不到該題目") {
        alert("請先確認題目資訊是否正確！");
        return;
    }

    statusMsg.style.color = "#bb86fc";
    statusMsg.innerText = "資料儲存中...";

    const payload = {
        id: id,
        title: title,
        difficulty: difficulty,
        notes: notes
    };

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if(result.status === "success") {
            statusMsg.style.color = "#4caf50";
            statusMsg.innerText = "🎉 成功儲存至 Google 試算表！";
            // 清空表單
            document.getElementById('questionId').value = '';
            document.getElementById('questionTitle').value = '';
            document.getElementById('notes').value = '';
        } else {
            throw new Error("GAS 回傳失敗");
        }
    } catch (error) {
        statusMsg.style.color = "#ff5252";
        statusMsg.innerText = "儲存失敗，請檢查網路或 GAS 網址。";
        console.error("Error:", error);
    }
});

