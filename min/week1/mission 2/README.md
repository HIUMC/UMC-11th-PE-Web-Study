# 1주차 Backend Mission - 리워드 서비스 ERD 설계

## 1. 서비스 소개

각 지역별로 가게들이 존재하며, 사용자가 가게의 미션을 수행하고 포인트를 모으는 리워드 서비스의 데이터베이스를 설계하였다.

### 핵심 규칙

- 지역별로 여러 가게가 존재한다.
- 각 가게에는 여러 미션이 존재한다.
- 회원은 여러 미션을 수행할 수 있다.
- 각 지역에서 미션 10개를 완료하면 1,000 Point를 지급한다.
- 동일한 지역의 보상은 한 번만 받을 수 있다.

---

## 2. 요구사항

### 로그인 / 회원가입

- 소셜 로그인을 지원한다.
- 회원의 소셜 로그인 정보를 저장한다.
- 동일한 소셜 계정으로 중복 가입할 수 없도록 한다.

### 지역 / 가게

- 여러 지역이 존재한다.
- 하나의 지역에는 여러 가게가 존재할 수 있다.
- 가게는 하나의 음식 카테고리에 속한다.

### 미션

- 하나의 가게에는 여러 미션이 존재할 수 있다.
- 한 회원은 여러 미션을 수행할 수 있다.
- 하나의 미션도 여러 회원이 수행할 수 있다.
- 회원별 미션 진행 상태와 완료 시점을 저장한다.

### 지역 보상

- 한 지역에서 미션 10개를 완료하면 1,000 Point를 지급한다.
- 동일한 회원에게 같은 지역 보상이 중복 지급되지 않도록 한다.

### 이번 설계에서 제외한 기능

미션 요구사항에 따라 다음 기능은 설계 대상에서 제외하였다.

- 지도 및 검색 기능
- 포인트 내역 관리
- 알림 설정
- 사장님의 점포 관리 기능

---

## 4. 테이블 구성

| 테이블 | 역할 |
| --- | --- |
| `member` | 회원 및 소셜 로그인 정보 관리 |
| `region` | 지역 정보 관리 |
| `food_category` | 가게 음식 카테고리 관리 |
| `store` | 지역별 가게 정보 관리 |
| `mission` | 가게별 미션 정보 관리 |
| `member_mission` | 회원의 미션 수행 내역 관리 |
| `member_region_reward` | 회원의 지역별 보상 지급 내역 관리 |

---

## 5. 테이블 관계

### region - store

하나의 지역에는 여러 가게가 존재할 수 있다.

`region 1 : N store`

`store` 테이블의 `region_id`가 `region.id`를 참조한다.

---

### food_category - store

하나의 음식 카테고리에는 여러 가게가 속할 수 있다.

`food_category 1 : N store`

`store` 테이블의 `food_category_id`가 `food_category.id`를 참조한다.

---

### store - mission

하나의 가게에는 여러 개의 미션이 존재할 수 있다.

`store 1 : N mission`

`mission` 테이블의 `store_id`가 `store.id`를 참조한다.

---

### member - mission

한 회원은 여러 미션을 수행할 수 있고, 하나의 미션도 여러 회원이 수행할 수 있기 때문에 N:M 관계가 발생한다.

이를 직접 연결하지 않고 `member_mission` 매핑 테이블을 사용하였다.

`member 1 : N member_mission`

`mission 1 : N member_mission`

따라서 전체적인 관계는 다음과 같다.

`member N : M mission`

---

### member - region

회원은 여러 지역의 보상을 받을 수 있고, 한 지역에서도 여러 회원이 보상을 받을 수 있다.

따라서 회원과 지역 역시 N:M 관계이며, `member_region_reward` 테이블을 통해 관리하였다.

`member 1 : N member_region_reward`

`region 1 : N member_region_reward`

---

## 6. DDL

```sql
CREATE TABLE member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    social_type VARCHAR(20) NOT NULL,
    social_id VARCHAR(100) NOT NULL,
    nickname VARCHAR(30) NOT NULL,
    point BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT uq_member_social
        UNIQUE (social_type, social_id)
);


CREATE TABLE region (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);


CREATE TABLE food_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);


CREATE TABLE store (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    region_id BIGINT NOT NULL,
    food_category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT fk_store_region
        FOREIGN KEY (region_id)
        REFERENCES region(id),

    CONSTRAINT fk_store_food_category
        FOREIGN KEY (food_category_id)
        REFERENCES food_category(id)
);


CREATE TABLE mission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT fk_mission_store
        FOREIGN KEY (store_id)
        REFERENCES store(id)
);


CREATE TABLE member_mission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    mission_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_mission_member
        FOREIGN KEY (member_id)
        REFERENCES member(id),

    CONSTRAINT fk_member_mission_mission
        FOREIGN KEY (mission_id)
        REFERENCES mission(id),

    CONSTRAINT uq_member_mission
        UNIQUE (member_id, mission_id)
);


CREATE TABLE member_region_reward (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    region_id BIGINT NOT NULL,
    reward_point INT NOT NULL DEFAULT 1000,
    rewarded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_region_reward_member
        FOREIGN KEY (member_id)
        REFERENCES member(id),

    CONSTRAINT fk_member_region_reward_region
        FOREIGN KEY (region_id)
        REFERENCES region(id),

    CONSTRAINT uq_member_region_reward
        UNIQUE (member_id, region_id)
);
```

---

## 7. 설계 포인트

### 1. 회원과 미션의 N:M 관계 처리

회원 한 명은 여러 미션을 수행할 수 있고, 하나의 미션도 여러 회원이 수행할 수 있다.

따라서 두 테이블을 직접 연결하지 않고 `member_mission` 테이블을 생성하여 N:M 관계를 해소하였다.

`member_mission`에는 단순한 관계뿐만 아니라 다음과 같은 미션 수행 정보도 저장한다.

- `status`: 미션 진행 상태
- `completed_at`: 미션 완료 시점

---

### 2. 동일 미션 중복 수행 데이터 방지

`member_mission`에는 다음 UNIQUE 제약조건을 적용하였다.

```sql
UNIQUE (member_id, mission_id)
```

이를 통해 같은 회원과 같은 미션의 데이터가 여러 번 생성되는 것을 DB 레벨에서 방지하였다.

---

### 3. 지역별 보상 중복 지급 방지

지역별 미션 완료 개수는 `member_mission`, `mission`, `store`를 이용하여 계산할 수 있다.

하지만 미션 10개를 완료했을 때 1,000 Point를 이미 지급했는지 여부는 별도로 관리할 필요가 있다.

따라서 `member_region_reward` 테이블을 생성하였다.

```sql
UNIQUE (member_id, region_id)
```

제약조건을 적용하여 한 회원이 같은 지역의 보상을 두 번 받을 수 없도록 하였다.

---

### 4. 소셜 계정 중복 가입 방지

소셜 로그인 제공자와 소셜 계정의 식별자를 함께 UNIQUE로 설정하였다.

```sql
UNIQUE (social_type, social_id)
```

예를 들어 같은 카카오 계정이 두 개의 회원 데이터로 생성되는 것을 방지할 수 있다.

---

### 5. Soft Delete

`member`, `region`, `food_category`, `store`, `mission`에는 `deleted_at` 컬럼을 두었다.

데이터를 실제로 삭제하는 대신 삭제 시점을 저장하여 기존 데이터와의 관계를 유지할 수 있도록 설계하였다.

---

## 8. 회고

이번 미션을 통해 화면에 존재하는 데이터를 그대로 테이블로 만드는 것이 아니라, 요구사항에서 각 데이터 사이의 관계를 먼저 파악하는 것이 중요하다는 점을 알게 되었다.

특히 회원과 미션처럼 N:M 관계가 발생하는 경우 중간 테이블을 두어 관계를 해결하는 방법을 이해할 수 있었다.

또한 지역 미션 10개 완료 시 1,000 Point를 지급하는 요구사항을 구현할 때 단순히 완료한 미션의 개수만 계산하는 것이 아니라, 이미 보상을 지급했는지를 별도로 관리해야 중복 지급을 방지할 수 있다는 점을 고려하여 `member_region_reward` 테이블을 추가하였다.