// // This is your modernized Prisma schema file
// // Enhanced for a more comprehensive e-learning platform like edX or Udemy

// generator client {
//     provider = "prisma-client-js"
//   }
  
//   datasource db {
//     provider = "postgresql"
//     url      = env("DATABASE_URL")
//   }
  
//   // USER MANAGEMENT MODELS
//   model User {
//     id                Int       @id @default(autoincrement())
//     firstName         String
//     lastName          String
//     email             String    @unique
//     password          String
//     role              Role      @default(STUDENT)
//     isEmailVerified   Boolean   @default(false)
//     verificationToken String?
//     bio               String?   @db.Text
//     profilePicture    String?
//     socialLinks       Json?     // Store social media links
//     preferences       Json?     // Store user preferences (notifications, theme, etc)
//     lastLogin         DateTime?
//     createdAt         DateTime  @default(now())
//     updatedAt         DateTime  @updatedAt
  
//     // Relations
//     instructor        Instructor?
//     student           Student?
//     reviews           Review[]
//     notifications     Notification[]
//     achievements      UserAchievement[]
//     forumPosts        ForumPost[]
//     forumComments     ForumComment[]
//     certificates      Certificate[]
//   }
  
//   model Instructor {
//     id              Int      @id @default(autoincrement())
//     user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
//     userId          Int      @unique
//     expertise       String[]
//     biography       String   @db.Text
//     qualifications  String?  @db.Text
//     rating          Float?   @default(0)
//     isVerified      Boolean  @default(false)
//     paymentDetails  Json?
//     createdAt       DateTime @default(now())
//     updatedAt       DateTime @updatedAt
  
//     // Relations
//     courses         CourseInstructor[]
//     announcements   Announcement[]
//   }
  
//   model Student {
//     id              Int      @id @default(autoincrement())
//     user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
//     userId          Int      @unique
//     educationLevel  String?
//     interests       String[]
//     createdAt       DateTime @default(now())
//     updatedAt       DateTime @updatedAt
  
//     // Relations
//     enrollments     Enrollment[]
//     progress        CourseProgress[]
//     quizAttempts    QuizAttempt[]
//     assignments     AssignmentSubmission[]
//     notes           Note[]
//     wishlist        WishlistItem[]
//     cart            CartItem[]
//     payments        Payment[]
//   }
  
//   // COURSE CONTENT MODELS
//   model Course {
//     id                  Int       @id @default(autoincrement())
//     slug                String    @unique
//     title               String
//     subtitle            String?
//     description         String    @db.Text
//     level               Level
//     language            String
//     category            Category  @relation(fields: [categoryId], references: [id])
//     categoryId          Int
//     subcategory         Subcategory? @relation(fields: [subcategoryId], references: [id])
//     subcategoryId       Int?
//     thumbnail           String?
//     previewVideo        String?
//     duration            Int       // Total minutes
//     price               Decimal   @db.Decimal(10, 2)
//     salePrice           Decimal?  @db.Decimal(10, 2)
//     isFeatured          Boolean   @default(false)
//     isPremium           Boolean   @default(false)
//     isPublished         Boolean   @default(false)
//     publicationDate     DateTime?
//     requirements        String[]
//     objectives          String[]
//     tags                String[]
//     averageRating       Float     @default(0)
//     totalEnrollments    Int       @default(0)
//     createdAt           DateTime  @default(now())
//     updatedAt           DateTime  @updatedAt
  
//     // Relations
//     instructors         CourseInstructor[]
//     sections            CourseSection[]
//     enrollments         Enrollment[]
//     reviews             Review[]
//     announcements       Announcement[]
//     forums              Forum[]
//     certificates        CertificateTemplate?
//     wishlistedBy        WishlistItem[]
//     cartItems           CartItem[]
//   }
  
//   model CourseInstructor {
//     id             Int        @id @default(autoincrement())
//     course         Course     @relation(fields: [courseId], references: [id])
//     courseId       Int
//     instructor     Instructor @relation(fields: [instructorId], references: [id])
//     instructorId   Int
//     isMainInstructor Boolean  @default(false)
//     permissions    Permission[]
//     assignedAt     DateTime   @default(now())
  
//     @@unique([courseId, instructorId])
//   }
  
//   model CourseSection {
//     id              Int       @id @default(autoincrement())
//     title           String
//     description     String?   @db.Text
//     position        Int
//     course          Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
//     courseId        Int
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     // Relations
//     lessons         Lesson[]
//   }
  
//   model Lesson {
//     id              Int       @id @default(autoincrement())
//     title           String
//     type            LessonType
//     section         CourseSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
//     sectionId       Int
//     position        Int
//     duration        Int?      // Minutes
//     isPreview       Boolean   @default(false)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     // Content based on type
//     videoUrl        String?
//     textContent     String?   @db.Text
//     documentUrl     String?
//     quizId          Int?      @unique
//     quiz            Quiz?     @relation(fields: [quizId], references: [id])
//     assignmentId    Int?      @unique
//     assignment      Assignment? @relation(fields: [assignmentId], references: [id])
  
//     // Relations
//     progress        LessonProgress[]
//     resources       Resource[]
//   }
  
//   model Resource {
//     id              Int       @id @default(autoincrement())
//     title           String
//     type            ResourceType
//     url             String
//     description     String?   @db.Text
//     lesson          Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
//     lessonId        Int
//     createdAt       DateTime  @default(now())
//   }
  
//   // ASSESSMENT MODELS
//   model Quiz {
//     id              Int       @id @default(autoincrement())
//     title           String
//     description     String?   @db.Text
//     timeLimit       Int?      // Minutes
//     passingScore    Int       @default(70) // Percentage
//     maxAttempts     Int?
//     shuffleQuestions Boolean  @default(false)
//     isActive        Boolean   @default(true)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     // Relations
//     lesson          Lesson?
//     questions       QuizQuestion[]
//     attempts        QuizAttempt[]
//   }
  
//   model QuizQuestion {
//     id              Int       @id @default(autoincrement())
//     quiz            Quiz      @relation(fields: [quizId], references: [id], onDelete: Cascade)
//     quizId          Int
//     questionText    String    @db.Text
//     type            QuestionType
//     options         Json?     // For multiple choice, etc.
//     correctAnswer   Json?     // Answer or array of correct answers
//     explanation     String?   @db.Text
//     points          Int       @default(1)
//     position        Int
  
//     // Relations
//     responses       QuizResponse[]
//   }
  
//   model QuizAttempt {
//     id              Int       @id @default(autoincrement())
//     quiz            Quiz      @relation(fields: [quizId], references: [id])
//     quizId          Int
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     score           Int?      // Final percentage score
//     startedAt       DateTime  @default(now())
//     completedAt     DateTime?
//     timeSpent       Int?      // Minutes spent
//     isPassed        Boolean?
  
//     // Relations
//     responses       QuizResponse[]
  
//     @@unique([quizId, studentId, startedAt])
//   }
  
//   model QuizResponse {
//     id              Int       @id @default(autoincrement())
//     attempt         QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
//     attemptId       Int
//     question        QuizQuestion @relation(fields: [questionId], references: [id])
//     questionId      Int
//     answerGiven     Json?     // User's answer(s)
//     isCorrect       Boolean?
//     points          Int?      // Points earned
    
//     @@unique([attemptId, questionId])
//   }
  
//   model Assignment {
//     id              Int       @id @default(autoincrement())
//     title           String
//     description     String    @db.Text
//     instructions    String    @db.Text
//     dueDate         DateTime?
//     totalPoints     Int       @default(100)
//     passingScore    Int       @default(60) // Percentage
//     allowLateSubmissions Boolean @default(false)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     // Relations
//     lesson          Lesson?
//     submissions     AssignmentSubmission[]
//     rubrics         AssignmentRubric[]
//   }
  
//   model AssignmentRubric {
//     id              Int       @id @default(autoincrement())
//     assignment      Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
//     assignmentId    Int
//     criterion       String
//     description     String    @db.Text
//     maxPoints       Int
//     position        Int
//   }
  
//   model AssignmentSubmission {
//     id              Int       @id @default(autoincrement())
//     assignment      Assignment @relation(fields: [assignmentId], references: [id])
//     assignmentId    Int
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     submissionText  String?   @db.Text
//     fileUrls        String[]
//     submittedAt     DateTime  @default(now())
//     grade           Int?
//     feedback        String?   @db.Text
//     gradedAt        DateTime?
//     isLate          Boolean   @default(false)
  
//     @@unique([assignmentId, studentId])
//   }
  
//   // ENROLLMENT AND PROGRESS MODELS
//   model Enrollment {
//     id              Int       @id @default(autoincrement())
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     course          Course    @relation(fields: [courseId], references: [id])
//     courseId        Int
//     enrollmentDate  DateTime  @default(now())
//     expiryDate      DateTime?
//     status          EnrollmentStatus @default(ACTIVE)
//     completedAt     DateTime?
//     progressPercentage Int     @default(0)
//     certificate     Certificate?
  
//     @@unique([studentId, courseId])
//   }
  
//   model CourseProgress {
//     id              Int       @id @default(autoincrement())
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     courseId        Int
//     totalLessons    Int       @default(0)
//     completedLessons Int      @default(0)
//     lastAccessedAt  DateTime  @default(now())
  
//     // Relations
//     lessonProgress  LessonProgress[]
  
//     @@unique([studentId, courseId])
//   }
  
//   model LessonProgress {
//     id              Int       @id @default(autoincrement())
//     courseProgress  CourseProgress @relation(fields: [progressId], references: [id], onDelete: Cascade)
//     progressId      Int
//     lesson          Lesson    @relation(fields: [lessonId], references: [id])
//     lessonId        Int
//     status          ProgressStatus @default(NOT_STARTED)
//     completedAt     DateTime?
//     timeSpent       Int?      // Minutes spent
//     lastPosition    Int?      // For video content - seconds into the video
  
//     @@unique([progressId, lessonId])
//   }
  
//   // ENGAGEMENT MODELS
//   model Review {
//     id              Int       @id @default(autoincrement())
//     course          Course    @relation(fields: [courseId], references: [id])
//     courseId        Int
//     user            User      @relation(fields: [userId], references: [id])
//     userId          Int
//     rating          Int       // 1-5 stars
//     comment         String?   @db.Text
//     isPublished     Boolean   @default(true)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     @@unique([courseId, userId])
//   }
  
//   model Forum {
//     id              Int       @id @default(autoincrement())
//     course          Course    @relation(fields: [courseId], references: [id])
//     courseId        Int
//     title           String
//     description     String?   @db.Text
//     isActive        Boolean   @default(true)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     // Relations
//     posts           ForumPost[]
//   }
  
//   model ForumPost {
//     id              Int       @id @default(autoincrement())
//     forum           Forum     @relation(fields: [forumId], references: [id])
//     forumId         Int
//     user            User      @relation(fields: [userId], references: [id])
//     userId          Int
//     title           String
//     content         String    @db.Text
//     isPinned        Boolean   @default(false)
//     isLocked        Boolean   @default(false)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     // Relations
//     comments        ForumComment[]
//   }
  
//   model ForumComment {
//     id              Int       @id @default(autoincrement())
//     post            ForumPost @relation(fields: [postId], references: [id])
//     postId          Int
//     user            User      @relation(fields: [userId], references: [id])
//     userId          Int
//     content         String    @db.Text
//     parentId        Int?      // For nested comments
//     isApproved      Boolean   @default(true)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
//   }
  
//   model Announcement {
//     id              Int       @id @default(autoincrement())
//     course          Course    @relation(fields: [courseId], references: [id])
//     courseId        Int
//     instructor      Instructor @relation(fields: [instructorId], references: [id])
//     instructorId    Int
//     title           String
//     content         String    @db.Text
//     isPinned        Boolean   @default(false)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
//   }
  
//   model Note {
//     id              Int       @id @default(autoincrement())
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     courseId        Int
//     lessonId        Int?
//     content         String    @db.Text
//     timestamp       Int?      // For video notes - seconds into the video
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
//   }
  
//   // ACHIEVEMENT AND CERTIFICATION MODELS
//   model Achievement {
//     id              Int       @id @default(autoincrement())
//     title           String
//     description     String    @db.Text
//     image           String
//     criteria        String    @db.Text
//     points          Int       @default(0)
//     isActive        Boolean   @default(true)
  
//     // Relations
//     userAchievements UserAchievement[]
//   }
  
//   model UserAchievement {
//     id              Int       @id @default(autoincrement())
//     user            User      @relation(fields: [userId], references: [id])
//     userId          Int
//     achievement     Achievement @relation(fields: [achievementId], references: [id])
//     achievementId   Int
//     awardedAt       DateTime  @default(now())
  
//     @@unique([userId, achievementId])
//   }
  
//   model CertificateTemplate {
//     id              Int       @id @default(autoincrement())
//     course          Course    @relation(fields: [courseId], references: [id])
//     courseId        Int       @unique
//     templateUrl     String
//     isActive        Boolean   @default(true)
//     createdAt       DateTime  @default(now())
//     updatedAt       DateTime  @updatedAt
  
//     // Relations
//     certificates    Certificate[]
//   }
  
//   model Certificate {
//     id              Int       @id @default(autoincrement())
//     enrollment      Enrollment @relation(fields: [enrollmentId], references: [id])
//     enrollmentId    Int       @unique
//     template        CertificateTemplate @relation(fields: [templateId], references: [id])
//     templateId      Int
//     user            User      @relation(fields: [userId], references: [id])
//     userId          Int
//     certificateUrl  String
//     issuedAt        DateTime  @default(now())
//     expiresAt       DateTime?
//     verificationCode String    @unique
  
//     @@index([verificationCode])
//   }
  
//   // CATEGORIES AND ORGANIZATION
//   model Category {
//     id              Int       @id @default(autoincrement())
//     name            String    @unique
//     slug            String    @unique
//     description     String?   @db.Text
//     icon            String?
//     isActive        Boolean   @default(true)
    
//     // Relations
//     courses         Course[]
//     subcategories   Subcategory[]
//   }
  
//   model Subcategory {
//     id              Int       @id @default(autoincrement())
//     name            String
//     slug            String
//     description     String?   @db.Text
//     category        Category  @relation(fields: [categoryId], references: [id])
//     categoryId      Int
//     isActive        Boolean   @default(true)
    
//     // Relations
//     courses         Course[]
  
//     @@unique([slug, categoryId])
//   }
  
//   // E-COMMERCE MODELS
//   model WishlistItem {
//     id              Int       @id @default(autoincrement())
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     course          Course    @relation(fields: [courseId], references: [id])
//     courseId        Int
//     addedAt         DateTime  @default(now())
  
//     @@unique([studentId, courseId])
//   }
  
//   model CartItem {
//     id              Int       @id @default(autoincrement())
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     course          Course    @relation(fields: [courseId], references: [id])
//     courseId        Int
//     price           Decimal   @db.Decimal(10, 2)
//     addedAt         DateTime  @default(now())
  
//     @@unique([studentId, courseId])
//   }
  
//   model Coupon {
//     id              Int       @id @default(autoincrement())
//     code            String    @unique
//     discountType    DiscountType
//     discountValue   Decimal   @db.Decimal(10, 2)
//     maxUses         Int?
//     currentUses     Int       @default(0)
//     minPurchase     Decimal?  @db.Decimal(10, 2)
//     applicableCourses Int[]
//     startDate       DateTime  @default(now())
//     endDate         DateTime?
//     isActive        Boolean   @default(true)
  
//     // Relations
//     payments        Payment[]
//   }
  
//   model Payment {
//     id              Int       @id @default(autoincrement())
//     student         Student   @relation(fields: [studentId], references: [id])
//     studentId       Int
//     amount          Decimal   @db.Decimal(10, 2)
//     currency        String    @default("USD")
//     coupon          Coupon?   @relation(fields: [couponId], references: [id])
//     couponId        Int?
//     discountAmount  Decimal?  @db.Decimal(10, 2)
//     paymentMethod   String
//     paymentStatus   PaymentStatus @default(PENDING)
//     transactionId   String?   @unique
//     purchasedCourses Json     // Array of course IDs
//     createdAt       DateTime  @default(now())
//     completedAt     DateTime?
//   }
  
//   // USER COMMUNICATION MODELS
//   model Notification {
//     id              Int       @id @default(autoincrement())
//     user            User      @relation(fields: [userId], references: [id])
//     userId          Int
//     type            NotificationType
//     title           String
//     message         String    @db.Text
//     isRead          Boolean   @default(false)
//     relatedId       Int?      // ID of related entity (course, forum post, etc.)
//     relatedType     String?   // Type of related entity
//     createdAt       DateTime  @default(now())
//   }
  
//   // ENUMS
//   enum Role {
//     ADMIN
//     INSTRUCTOR
//     STUDENT
//     MODERATOR
//   }
  
//   enum Permission {
//     EDIT_COURSE
//     MANAGE_STUDENTS
//     GRADE_ASSIGNMENTS
//     MODERATE_DISCUSSIONS
//     SEND_ANNOUNCEMENTS
//   }
  
//   enum Level {
//     BEGINNER
//     INTERMEDIATE
//     ADVANCED
//     ALL_LEVELS
//   }
  
//   enum LessonType {
//     VIDEO
//     TEXT
//     DOCUMENT
//     QUIZ
//     ASSIGNMENT
//     INTERACTIVE
//   }
  
//   enum ResourceType {
//     PDF
//     CODE
//     IMAGE
//     AUDIO
//     PRESENTATION
//     LINK
//     ARCHIVE
//     OTHER
//   }
  
//   enum QuestionType {
//     MULTIPLE_CHOICE
//     TRUE_FALSE
//     SHORT_ANSWER
//     ESSAY
//     FILL_IN_BLANK
//     MATCHING
//     CODE
//   }
  
//   enum EnrollmentStatus {
//     ACTIVE
//     COMPLETED
//     PAUSED
//     EXPIRED
//     REFUNDED
//   }
  
//   enum ProgressStatus {
//     NOT_STARTED
//     IN_PROGRESS
//     COMPLETED
//   }
  
//   enum DiscountType {
//     PERCENTAGE
//     FIXED_AMOUNT
//   }
  
//   enum PaymentStatus {
//     PENDING
//     COMPLETED
//     FAILED
//     REFUNDED
//   }
  
//   enum NotificationType {
//     COURSE_UPDATE
//     ASSIGNMENT_GRADED
//     ANNOUNCEMENT
//     FORUM_ACTIVITY
//     ACHIEVEMENT
//     SYSTEM
//     PAYMENT
//   }