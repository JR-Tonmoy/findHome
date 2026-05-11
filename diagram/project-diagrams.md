# BashaLagbe Diagrams

These diagrams are written to match the current project structure of BashaLagbe - Online House Rent Management System.

## ERD
```mermaid
erDiagram
    USERS ||--o{ PROPERTIES : owns
    USERS ||--o{ SETTINGS : has
    USERS ||--o{ PERSONAL_ACCESS_TOKENS : uses

    USERS {
        bigint id
        string name
        string email
        string phone
        string role
        string password
    }

    PROPERTIES {
        bigint id
        string property_id
        bigint user_id
        string title
        string category
        string type
        string location
        string price
        string priceType
        integer beds
        integer baths
        integer bedrooms
        integer bathrooms
        integer sqft
        string floor
        text description
        json features
        json images
        longText image
        string owner_name
        string owner_phone
        string owner_email
        json raw
    }

    SETTINGS {
        bigint id
        bigint user_id
        string key
        boolean value
    }

    PERSONAL_ACCESS_TOKENS {
        bigint id
        bigint tokenable_id
        string tokenable_type
        string name
        string token
    }
```

## UML Class Diagram
```mermaid
classDiagram
    class User {
        +id
        +name
        +email
        +phone
        +role
        +password
    }

    class Property {
        +id
        +property_id
        +user_id
        +title
        +category
        +type
        +location
        +price
        +priceType
        +features
        +images
        +owner_name
        +owner_phone
        +owner_email
    }

    class Setting {
        +id
        +user_id
        +key
        +value
    }

    class AuthController {
        +register()
        +login()
        +me()
        +logout()
    }

    class PropertyController {
        +index()
        +store()
        +show()
        +update()
        +destroy()
    }

    class SettingController {
        +index()
        +update()
    }

    User "1" --> "many" Property : owns
    User "1" --> "many" Setting : has
    AuthController ..> User
    PropertyController ..> Property
    SettingController ..> Setting
```

## Admin Activity Diagram
```mermaid
flowchart TD
    A([Start]) --> B[Login as Admin]
    B --> C[Open Admin Dashboard]
    C --> D[View stats and notifications]
    D --> E{Choose action}
    E --> F[Manage users]
    E --> G[Manage owners]
    E --> H[Manage properties]
    E --> I[Edit admin profile]
    F --> J[Review member data]
    G --> J
    H --> K[Approve, edit, or delete properties]
    I --> L[Save profile changes]
    J --> M([End])
    K --> M
    L --> M
```

## Tenant Activity Diagram
```mermaid
flowchart TD
    A([Start]) --> B[Login as Tenant]
    B --> C[Open Tenant Dashboard]
    C --> D[Browse properties]
    D --> E[Open property details]
    E --> F{Save or book?}
    F --> G[Save house]
    F --> H[Create booking request]
    G --> I[Review saved houses]
    H --> J[Fill booking form]
    J --> K[Confirm booking request]
    K --> L[Track request or order status]
    I --> M([End])
    L --> M
```

## Owner Activity Diagram
```mermaid
flowchart TD
    A([Start]) --> B[Login as Owner]
    B --> C[Open Owner Dashboard]
    C --> D[View my properties]
    D --> E{Action}
    E --> F[Add property]
    E --> G[Edit property]
    E --> H[Update owner profile]
    F --> I[Submit property details]
    G --> I
    H --> J[Save profile changes]
    I --> K[Property appears in public feed]
    J --> L([End])
    K --> L
```

## Swimlane Diagram
```mermaid
flowchart LR
    subgraph Tenant
        T1[Login]
        T2[Browse properties]
        T3[Open property details]
        T4[Send booking request]
    end

    subgraph Frontend
        F1[Role-based route check]
        F2[Render dashboard pages]
        F3[Load property feed from storage/API]
        F4[Show booking form]
    end

    subgraph Backend
        B1[Sanctum auth]
        B2[Property API]
        B3[Settings API]
    end

    subgraph Owner
        O1[Login]
        O2[Add or edit property]
        O3[Publish property]
    end

    subgraph Admin
        A1[Login]
        A2[View notifications]
        A3[Manage users and properties]
    end

    T1 --> F1 --> B1
    T1 --> F2
    T2 --> F3 --> B2
    T3 --> F4
    T4 --> F4 --> A2
    O1 --> F1 --> B1
    O2 --> F2 --> B2
    O3 --> F3
    A1 --> F1 --> B1
    A2 --> F2
    A3 --> B2
```

## Notes
- The ERD reflects the current Laravel database tables.
- Booking and payment are shown as a current workflow, because the codebase does not yet have dedicated booking/payment tables.
- The swimlane diagram is a conceptual view of how tenant, owner, admin, frontend, and backend work together.