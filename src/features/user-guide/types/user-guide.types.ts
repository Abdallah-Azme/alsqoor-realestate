// User guide section type
export interface UserGuideSection {
  title: string;
  content: string;
  image?: string;
}

// User guide response type
export interface UserGuide {
  sections: UserGuideSection[];
}
