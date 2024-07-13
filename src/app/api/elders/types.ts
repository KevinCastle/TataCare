export type Elder = {
    id: string;
    name: string;
    surname: string;
    sex: string;
    blood_type: string;
    insurance: string;
    diabetic: boolean;
    hypertensive: boolean;
    birthdate: string;
    nationality: string;
    identification_number: string;
    kidney_failure: boolean;
    urinary_incontinence: boolean;
    avatar: string;
    favorite_contact: string;
};

export type ElderUser = {
    elder_id: string;
    user_id: string;
};

export type Shared = {
    id: string;
    date: string;
    elder_id: string;
    used: boolean;
};
