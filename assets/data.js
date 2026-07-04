window.ODFLOW_TEMPLATES = [
  {
    "id": "meeting_minutes",
    "name": "會議紀錄",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "記錄會議開始、報告事項、討論案由、表決結果與後續追蹤。",
    "file": "downloads/meeting_minutes.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "會議紀錄"
  },
  {
    "id": "meeting_notice",
    "name": "開會通知單",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "發送正式會議時間、地點、出席者與附件通知。",
    "file": "downloads/meeting_notice.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "開會通知單"
  },
  {
    "id": "meeting_agenda",
    "name": "會議議程",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "安排會議流程、報告事項與討論事項。",
    "file": "",
    "generate": true,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "會議議程"
  },
  {
    "id": "attendance_sheet",
    "name": "簽到表",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "提供活動、社課或會議現場簽到使用。",
    "file": "downloads/attendance_sheet.odt",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "club_announcement",
    "name": "社團公告／通知",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "發布一般社團公告、活動提醒與行政通知。",
    "file": "",
    "generate": false,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動企劃書"
  },
  {
    "id": "activity_proposal",
    "name": "活動企畫書",
    "category": "專案活動型",
    "fmt": "ODT",
    "desc": "撰寫活動宗旨、內容、流程、分工與預算。",
    "file": "downloads/activity_proposal.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "activity_application",
    "name": "活動申請表",
    "category": "專案活動型",
    "fmt": "ODT",
    "desc": "依學校格式整理活動申請與行政審核資料。",
    "file": "downloads/activity_application.odt",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "activity_result_report",
    "name": "活動成果報告",
    "category": "專案活動型",
    "fmt": "ODT",
    "desc": "整理活動紀錄、工作人員、心得與照片成果。",
    "file": "downloads/activity_result_report.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動成果報告"
  },
  {
    "id": "activity_review_minutes",
    "name": "活動檢討會紀錄",
    "category": "專案活動型",
    "fmt": "ODT",
    "desc": "記錄活動後檢討、改善建議與後續追蹤事項。",
    "file": "",
    "generate": true,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動檢討會紀錄"
  },
  {
    "id": "activity_schedule",
    "name": "活動流程表",
    "category": "專案活動型",
    "fmt": "ODS",
    "desc": "安排活動粗流、細流、器材與現場負責人。",
    "file": "downloads/activity_schedule.ods",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "work_assignment",
    "name": "工作分配表",
    "category": "專案活動型",
    "fmt": "ODS",
    "desc": "追蹤活動前中後工作項目、負責人與完成狀態。",
    "file": "downloads/work_assignment.ods",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "annual_plan",
    "name": "年度計畫",
    "category": "社團運作型",
    "fmt": "ODT",
    "desc": "規劃社團年度目標、活動、社課、分工與預算。",
    "file": "",
    "generate": true,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "年度計畫"
  },
  {
    "id": "officer_roster",
    "name": "社團幹部名冊",
    "category": "社團運作型",
    "fmt": "ODS",
    "desc": "整理幹部職稱、組別、聯絡方式與交接狀態。",
    "file": "",
    "generate": false,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動企劃書"
  },
  {
    "id": "member_roster",
    "name": "社員名冊",
    "category": "社團運作型",
    "fmt": "ODS",
    "desc": "管理社員資料、社員狀態、社費狀態與聯絡方式。",
    "file": "",
    "generate": false,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動企劃書"
  },
  {
    "id": "course_record",
    "name": "社課紀錄",
    "category": "社團運作型",
    "fmt": "ODT",
    "desc": "記錄社課內容、出席情形、成果與後續追蹤。",
    "file": "",
    "generate": false,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動企劃書"
  },
  {
    "id": "equipment_borrowing_record",
    "name": "器材借用紀錄",
    "category": "社團運作型",
    "fmt": "ODS",
    "desc": "追蹤器材借出、歸還、逾期、損壞與遺失狀態。",
    "file": "",
    "generate": false,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動企劃書"
  },
  {
    "id": "expense_budget",
    "name": "經費預算表",
    "category": "財務與清冊型",
    "fmt": "ODS",
    "desc": "編列活動前預算、補助金額、自籌金額與總經費。",
    "file": "downloads/expense_budget.ods",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "income_expense_statement",
    "name": "經費收支表",
    "category": "財務與清冊型",
    "fmt": "ODS",
    "desc": "記錄社團日常收入、支出、餘額、代墊與活動結算狀態。",
    "file": "downloads/income_expense_statement.ods",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "expense_settlement",
    "name": "經費收支結算表",
    "category": "財務與清冊型",
    "fmt": "ODS",
    "desc": "整理單一活動預算通過金額、實際支出與補助核銷。",
    "file": "downloads/expense_settlement.ods",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "reimbursement_detail",
    "name": "核銷明細表",
    "category": "財務與清冊型",
    "fmt": "ODS",
    "desc": "整理單據、發票、付款方式、墊付款人與憑證狀態。",
    "file": "downloads/reimbursement_detail.ods",
    "generate": false,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "inventory",
    "name": "財產清冊",
    "category": "財務與清冊型",
    "fmt": "ODS",
    "desc": "整理社團財產、設備現況與保管資料。",
    "file": "",
    "generate": false,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動企劃書"
  },
  {
    "id": "subsidy_application",
    "name": "補助申請表",
    "category": "財務與清冊型",
    "fmt": "ODT",
    "desc": "整理補助申請內容、經費用途與送件附件。",
    "file": "",
    "generate": false,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動企劃書"
  }
];
window.ODFLOW_GENERATE_TEMPLATES = [
  {
    "id": "meeting_minutes",
    "name": "會議紀錄",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "記錄會議開始、報告事項、討論案由、表決結果與後續追蹤。",
    "file": "downloads/meeting_minutes.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "會議紀錄"
  },
  {
    "id": "meeting_notice",
    "name": "開會通知單",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "發送正式會議時間、地點、出席者與附件通知。",
    "file": "downloads/meeting_notice.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "開會通知單"
  },
  {
    "id": "meeting_agenda",
    "name": "會議議程",
    "category": "日常行政型",
    "fmt": "ODT",
    "desc": "安排會議流程、報告事項與討論事項。",
    "file": "",
    "generate": true,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "會議議程"
  },
  {
    "id": "activity_proposal",
    "name": "活動企畫書",
    "category": "專案活動型",
    "fmt": "ODT",
    "desc": "撰寫活動宗旨、內容、流程、分工與預算。",
    "file": "downloads/activity_proposal.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動企劃書"
  },
  {
    "id": "activity_result_report",
    "name": "活動成果報告",
    "category": "專案活動型",
    "fmt": "ODT",
    "desc": "整理活動紀錄、工作人員、心得與照片成果。",
    "file": "downloads/activity_result_report.odt",
    "generate": true,
    "downloadable": true,
    "implementedBlank": true,
    "schema": "活動成果報告"
  },
  {
    "id": "activity_review_minutes",
    "name": "活動檢討會紀錄",
    "category": "專案活動型",
    "fmt": "ODT",
    "desc": "記錄活動後檢討、改善建議與後續追蹤事項。",
    "file": "",
    "generate": true,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "活動檢討會紀錄"
  },
  {
    "id": "annual_plan",
    "name": "年度計畫",
    "category": "社團運作型",
    "fmt": "ODT",
    "desc": "規劃社團年度目標、活動、社課、分工與預算。",
    "file": "",
    "generate": true,
    "downloadable": false,
    "implementedBlank": false,
    "schema": "年度計畫"
  }
];
window.ODFLOW_DOC_SCHEMAS = {
  "會議紀錄": {
    "fields": [
      [
        "meeting_title",
        "會議名稱",
        "text"
      ],
      [
        "meeting_date",
        "會議日期",
        "date"
      ],
      [
        "meeting_time",
        "會議時間",
        "text"
      ],
      [
        "location",
        "會議地點",
        "text"
      ],
      [
        "chair",
        "主席",
        "text"
      ],
      [
        "recorder",
        "記錄人員",
        "text"
      ],
      [
        "attendees",
        "出席人員",
        "textarea"
      ],
      [
        "agenda",
        "討論事項 / 議案",
        "textarea"
      ],
      [
        "decision",
        "決議事項",
        "textarea"
      ],
      [
        "actions",
        "待辦事項",
        "textarea"
      ]
    ]
  },
  "活動企劃書": {
    "fields": [
      [
        "activity_name",
        "活動名稱",
        "text"
      ],
      [
        "activity_date",
        "活動日期",
        "date"
      ],
      [
        "activity_time",
        "活動時間",
        "text"
      ],
      [
        "location",
        "活動地點",
        "text"
      ],
      [
        "organizer",
        "主辦單位",
        "text"
      ],
      [
        "target",
        "活動對象",
        "text"
      ],
      [
        "purpose",
        "活動目的",
        "textarea"
      ],
      [
        "content",
        "活動內容與流程",
        "textarea"
      ],
      [
        "budget",
        "預算規劃",
        "textarea"
      ],
      [
        "benefits",
        "預期效益",
        "textarea"
      ]
    ]
  },
  "活動成果報告": {
    "fields": [
      [
        "activity_name",
        "活動名稱",
        "text"
      ],
      [
        "activity_date",
        "活動日期",
        "date"
      ],
      [
        "location",
        "活動地點",
        "text"
      ],
      [
        "participants",
        "參與人數",
        "text"
      ],
      [
        "organizer",
        "主辦單位",
        "text"
      ],
      [
        "summary",
        "活動摘要",
        "textarea"
      ],
      [
        "outcomes",
        "成果說明",
        "textarea"
      ],
      [
        "feedback",
        "回饋摘要",
        "textarea"
      ],
      [
        "expense",
        "經費摘要",
        "textarea"
      ],
      [
        "improvement",
        "改進建議",
        "textarea"
      ]
    ]
  },
  "年度計畫": {
    "fields": [
      [
        "academic_year",
        "學年度",
        "text"
      ],
      [
        "club_name",
        "社團名稱",
        "text"
      ],
      [
        "mission",
        "社團宗旨",
        "textarea"
      ],
      [
        "goals",
        "年度目標",
        "textarea"
      ],
      [
        "semester_plan",
        "學期規劃",
        "textarea"
      ],
      [
        "key_activities",
        "重點活動",
        "textarea"
      ],
      [
        "budget",
        "年度預算概述",
        "textarea"
      ]
    ]
  }
};
