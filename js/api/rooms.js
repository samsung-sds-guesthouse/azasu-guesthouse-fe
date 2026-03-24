async function getRooms(searchParams = {}) {
  console.log("Fetching rooms with params:", searchParams);

  const allRooms = [
    {
      id: 1,
      name: "와후 스탠다드룸",
      name_en: "Wafu Standard",
      category: "스탠다드",
      max_guests: 2,
      price: 180000,
      size: "38㎡",
      floor: "2층",
      description: "전통 다다미 바닥과 장지문(障子)으로 꾸며진 정통 일본식 객실입니다. 오랜 세월을 견뎌 온 히노키 목재의 향기와 함께 깊은 잠에 빠져드는 경험을 선사합니다.",
      amenities: ["다다미 바닥", "유카타 제공", "독립 욕실", "정원 뷰"],
      rules: "금연 객실 · 반려동물 출입 불가 · 체크인 15:00 이후",
      image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&q=70",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=70",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
      ],
      unavailable_dates: ["2025-05-10", "2025-05-11", "2025-05-25", "2025-06-01"],
    },
    {
      id: 2,
      name: "와후 디럭스룸",
      name_en: "Wafu Deluxe",
      category: "디럭스",
      max_guests: 3,
      price: 260000,
      size: "52㎡",
      floor: "3층",
      description: "넓은 다다미 공간과 별도의 라운지 코너가 마련된 디럭스 객실입니다. 계절마다 다른 표정을 보여주는 일본식 정원을 바라보며 사계절을 온전히 느낄 수 있습니다.",
      amenities: ["넓은 다다미", "전용 라운지", "히노키 욕조", "정원·산 뷰"],
      rules: "금연 객실 · 반려동물 출입 불가",
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&q=70",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
        "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=400&q=70",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=70",
      ],
      unavailable_dates: ["2025-05-20", "2025-05-21"],
    },
    {
      id: 3,
      name: "노천탕 스위트",
      name_en: "Rotenburo Suite",
      category: "스위트",
      max_guests: 2,
      price: 420000,
      size: "68㎡",
      floor: "4층",
      description: "객실 전용 노천탕(露天風呂)이 딸린 프라이빗 스위트입니다. 별빛 아래 온천을 즐기며 몸과 마음을 온전히 내려놓는 특별한 하룻밤을 경험하세요.",
      amenities: ["전용 노천탕", "다다미 메인룸", "히노키 반욕조", "최상층 조망"],
      rules: "금연 객실 · 2인 기준 · 어린이(12세 미만) 이용 불가",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&q=70",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
        "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=400&q=70",
      ],
      unavailable_dates: ["2025-06-05", "2025-06-06", "2025-06-07"],
    },
    {
      id: 4,
      name: "베테이 프리미엄 스위트",
      name_en: "Bettei Premium Suite",
      category: "스위트",
      max_guests: 4,
      price: 680000,
      size: "102㎡",
      floor: "독채",
      description: "아자수 최고의 숙박 경험을 선사하는 독채형 프리미엄 스위트입니다. 전용 정원, 독립 온천, 개인 집사 서비스가 포함되며 이곳에서의 하룻밤은 평생의 기억으로 남을 것입니다.",
      amenities: ["독채 전용", "전용 정원·온천", "집사 서비스", "전 객실 뷰"],
      rules: "금연 · 독채 완전 프라이빗 · 별도 문의 요망",
      image: "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=400&q=70",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=70",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
      ],
      unavailable_dates: [],
    },
  ];

  const { guests } = searchParams;
  if (guests) {
    return Promise.resolve(allRooms.filter(r => r.max_guests >= parseInt(guests)));
  }
  return Promise.resolve(allRooms);
}

async function getRoomDetail(roomId) {
  const allRooms = [
    {
      id: 1,
      name: "와후 스탠다드룸",
      name_en: "Wafu Standard",
      category: "스탠다드",
      max_guests: 2,
      price: 180000,
      size: "38㎡",
      floor: "2층",
      description: "전통 다다미 바닥과 장지문(障子)으로 꾸며진 정통 일본식 객실입니다. 오랜 세월을 견뎌 온 히노키 목재의 향기와 함께 깊은 잠에 빠져드는 경험을 선사합니다. 저녁에는 객실에서 직접 후톤을 펼쳐 드리는 전통 오리가에 서비스를 제공합니다.",
      amenities: ["다다미 바닥", "유카타 제공", "독립 욕실", "정원 뷰", "오리가에 서비스", "웰컴 와가시"],
      rules: "금연 객실 · 반려동물 출입 불가 · 체크인 15:00 이후 · 체크아웃 11:00까지",
      image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&q=70",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=70",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
      ],
      unavailable_dates: ["2025-05-10", "2025-05-11", "2025-05-25", "2025-06-01"],
    },
    {
      id: 2,
      name: "와후 디럭스룸",
      name_en: "Wafu Deluxe",
      category: "디럭스",
      max_guests: 3,
      price: 260000,
      size: "52㎡",
      floor: "3층",
      description: "넓은 다다미 공간과 별도의 라운지 코너가 마련된 디럭스 객실입니다. 계절마다 다른 표정을 보여주는 일본식 정원을 바라보며 사계절을 온전히 느낄 수 있습니다. 라운지 코너에는 전통 다도(茶道) 세트가 마련되어 있어 조용한 오전 시간을 더욱 특별하게 만들어 드립니다.",
      amenities: ["넓은 다다미", "전용 라운지", "히노키 욕조", "정원·산 뷰", "다도 세트", "프리미엄 유카타"],
      rules: "금연 객실 · 반려동물 출입 불가",
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&q=70",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
        "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=400&q=70",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=70",
      ],
      unavailable_dates: ["2025-05-20", "2025-05-21"],
    },
    {
      id: 3,
      name: "노천탕 스위트",
      name_en: "Rotenburo Suite",
      category: "스위트",
      max_guests: 2,
      price: 420000,
      size: "68㎡",
      floor: "4층",
      description: "객실 전용 노천탕(露天風呂)이 딸린 프라이빗 스위트입니다. 별빛 아래 온천을 즐기며 몸과 마음을 온전히 내려놓는 특별한 하룻밤을 경험하세요. 100% 천연 온천수로 채워지는 전용 노천탕은 24시간 이용 가능합니다.",
      amenities: ["전용 노천탕 (24h)", "다다미 메인룸", "히노키 반욕조", "최상층 조망", "프라이빗 테라스", "조식 객실 제공"],
      rules: "금연 객실 · 2인 기준 · 어린이(12세 미만) 이용 불가",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&q=70",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
        "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=400&q=70",
      ],
      unavailable_dates: ["2025-06-05", "2025-06-06", "2025-06-07"],
    },
    {
      id: 4,
      name: "베테이 프리미엄 스위트",
      name_en: "Bettei Premium Suite",
      category: "스위트",
      max_guests: 4,
      price: 680000,
      size: "102㎡",
      floor: "독채",
      description: "아자수 최고의 숙박 경험을 선사하는 독채형 프리미엄 스위트입니다. 전용 정원, 독립 온천, 개인 집사 서비스가 포함되며 이곳에서의 하룻밤은 평생의 기억으로 남을 것입니다. 특별한 기념일, 프러포즈, 혹은 일생에 한 번뿐인 여행을 위한 최상의 공간입니다.",
      amenities: ["독채 전용", "전용 정원·온천", "집사 서비스", "전 방향 파노라마 뷰", "카이세키 코스 조석식", "전용 차량 픽업"],
      rules: "금연 · 독채 완전 프라이빗 · 별도 문의 요망 · 최소 2박 이상",
      image: "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1596178060810-72660ee6e1a8?w=400&q=70",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=70",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?w=400&q=70",
      ],
      unavailable_dates: [],
    },
  ];

  const room = allRooms.find(r => r.id == roomId);
  if (room) return Promise.resolve(room);
  return Promise.reject(new Error("객실 정보를 찾을 수 없습니다."));
}