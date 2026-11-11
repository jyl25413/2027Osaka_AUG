// 2027 大阪之旅（2027-08-12–2027-08-17）
// 兩人同行（李家裕＋李孟慈）。機票已於 2026-11-10 在 Trip.com 下單付款。
// 行程可在「每日行程」頁直接編輯（存在手機本地）。
const itinerary = {
  "trip": {
    "title": "2027 大阪之旅",
    "startDate": "2027-08-12",
    "endDate": "2027-08-17",
    "subtitle": "台北 → 大阪 → 台北｜兩人同行・關西六天五夜"
  },
  "days": [
    {
      "id": "day1",
      "date": "2027-08-12",
      "weekday": "週四",
      "city": "台北 → 大阪",
      "summary": "一早飛關西，中午抵達、進市區，晚上逛道頓堀",
      "hotel": {
        "name": "待訂（大阪市區）",
        "mapQuery": "大阪 難波",
        "checkIn": "未訂",
        "note": "8/12–8/17 住大阪，飯店待確認。建議住難波／心齋橋一帶，去機場、逛街都方便。"
      },
      "schedule": [
        {
          "time": "08:55",
          "type": "flight",
          "title": "泰國獅航 SL396",
          "location": "桃園機場 T1 (TPE) → 關西機場 T1 (KIX) 12:30",
          "mapQuery": "桃園國際機場第一航廈",
          "note": "飛行約 3 小時 35 分。波音 737-800，經濟艙，無餐點。Trip.com 訂單 1658117044526396，訂位代號 WQTBTQ。去程行李：孟慈 10kg 託運（已加購），家裕無託運；每人手提 7kg＋個人物品 1 件。"
        },
        {
          "time": "12:30",
          "type": "note",
          "title": "抵達關西國際機場",
          "location": "關西國際機場 T1 (KIX)",
          "mapQuery": "關西國際機場",
          "note": "入境＋提領行李（只有孟慈有託運行李）。台灣護照免簽日本 90 天，護照效期確認無誤即可入境。"
        },
        {
          "time": "14:00",
          "type": "transport",
          "title": "關西機場 → 大阪市區",
          "location": "關西機場 → 難波／心齋橋（約 35–50 分鐘）",
          "mapQuery": "關西機場站",
          "note": "南海電鐵 Rapi:t 特急到難波約 35 分鐘，或 JR 關空快速到天王寺／大阪約 45–60 分鐘。ICOCA 卡現場買或用手機版 Suica／ICOCA 嗶進站。"
        },
        {
          "time": "15:30",
          "type": "note",
          "title": "飯店 check-in（待訂）",
          "location": "大阪市區（難波／心齋橋一帶，待確認）",
          "mapQuery": "大阪 難波",
          "note": "放行李、休息一下。飯店確認後補上名稱與地址。"
        },
        {
          "time": "18:00",
          "type": "restaurant",
          "title": "晚餐：道頓堀（建議，待確認）",
          "location": "大阪 道頓堀",
          "mapQuery": "大阪 道頓堀",
          "note": "建議：抵達當晚先去道頓堀／心齋橋逛逛吃晚餐（待確認）。章魚燒、大阪燒、串炸都在這一帶，詳見美食頁。"
        }
      ]
    },
    {
      "id": "day2",
      "date": "2027-08-13",
      "weekday": "週五",
      "city": "大阪",
      "summary": "待規劃",
      "hotel": {
        "name": "續住同一間（待訂）",
        "mapQuery": "大阪 難波",
        "checkIn": "未訂",
        "note": "飯店待確認。"
      },
      "schedule": [
        {
          "time": "全天",
          "type": "note",
          "title": "每日行程待規劃",
          "location": "大阪",
          "mapQuery": "大阪",
          "note": "每日行程等確認後補上。備選方向：大阪城、梅田購物、黑門市場（詳見收藏景點）。"
        }
      ]
    },
    {
      "id": "day3",
      "date": "2027-08-14",
      "weekday": "週六",
      "city": "大阪",
      "summary": "待規劃",
      "hotel": {
        "name": "續住同一間（待訂）",
        "mapQuery": "大阪 難波",
        "checkIn": "未訂",
        "note": "飯店待確認。"
      },
      "schedule": [
        {
          "time": "全天",
          "type": "note",
          "title": "每日行程待規劃",
          "location": "大阪",
          "mapQuery": "大阪",
          "note": "每日行程等確認後補上。備選方向：環球影城、通天閣／新世界（詳見收藏景點）。"
        }
      ]
    },
    {
      "id": "day4",
      "date": "2027-08-15",
      "weekday": "週日",
      "city": "大阪",
      "summary": "待規劃",
      "hotel": {
        "name": "續住同一間（待訂）",
        "mapQuery": "大阪 難波",
        "checkIn": "未訂",
        "note": "飯店待確認。"
      },
      "schedule": [
        {
          "time": "全天",
          "type": "note",
          "title": "每日行程待規劃",
          "location": "大阪",
          "mapQuery": "大阪",
          "note": "每日行程等確認後補上。備選方向：奈良／京都一日遊、梅田空中庭園（詳見收藏景點）。"
        }
      ]
    },
    {
      "id": "day5",
      "date": "2027-08-16",
      "weekday": "週一",
      "city": "大阪",
      "summary": "待規劃",
      "hotel": {
        "name": "續住同一間（待訂）",
        "mapQuery": "大阪 難波",
        "checkIn": "未訂",
        "note": "飯店待確認。明天回程，晚上先把行李整理好。"
      },
      "schedule": [
        {
          "time": "全天",
          "type": "note",
          "title": "每日行程待規劃",
          "location": "大阪",
          "mapQuery": "大阪",
          "note": "每日行程等確認後補上。備選方向：心齋橋購物、補逛沒去到的點（詳見收藏景點）。明天回程，晚上先把行李整理好。"
        }
      ]
    },
    {
      "id": "day6",
      "date": "2027-08-17",
      "weekday": "週二",
      "city": "大阪 → 台北",
      "summary": "白天最後採買，晚上飛回台北",
      "schedule": [
        {
          "time": "白天",
          "type": "note",
          "title": "最後採買＋退房",
          "location": "大阪市區",
          "mapQuery": "大阪 難波",
          "note": "退房後行李可寄放飯店。回程每人有 20kg 託運，伴手禮可以買；手提＋個人物品合計上限 7kg／人，注意別超重。"
        },
        {
          "time": "18:00",
          "type": "transport",
          "title": "大阪市區 → 關西機場",
          "location": "難波／大阪 → 關西機場（約 35–60 分鐘）",
          "mapQuery": "關西機場站",
          "note": "20:55 的飛機，國際線建議 2–3 小時前到機場。南海 Rapi:t 或 JR 關空快速回機場，預留充裕時間。"
        },
        {
          "time": "20:55",
          "type": "flight",
          "title": "馬來西亞亞洲航空 AK177",
          "location": "關西機場 T1 (KIX) → 桃園機場 T1 (TPE) 23:15",
          "mapQuery": "關西國際機場",
          "note": "飛行約 2 小時 20 分。空中巴士 A321neo，經濟艙，無餐點。Trip.com 訂單 1658117044607036，訂位代號 YJQ6SK。回程行李：每人 20kg 託運；手提＋個人物品合計上限 7kg／人。"
        }
      ]
    }
  ]
}

export default itinerary
