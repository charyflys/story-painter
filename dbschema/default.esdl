module default {
    type Record {
        required property keyandPassword -> str {
            constraint exclusive;
        };
        required property client -> str;
        required property created_at -> str ;
        required property data -> str; # 用于长文本数据
        required property name -> str;
        required property note -> str {
            default := "";
        };
        required property updated_at -> str ;
    };
};