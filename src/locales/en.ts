export default {
  common: {
    appName: 'DreamDuel',
    tagline: 'Your stories come to life',
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    share: 'Share',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    start: 'Start'
  },
  welcomeBanner: {
    title: '🎉 Welcome to DreamDuel!',
    message: 'Your',
    messageBold: 'first image is FREE',
    messageCta: '. Start creating now.'
  },
  nav: {
    home: 'Home',
    search: 'Search',
    create: 'Create',
    profile: 'Profile',
    settings: 'Settings',
    myProfile: 'My Profile',
    images: 'Images'
  },
  home: {
    hero: {
      title: 'Create Unique Visual Stories',
      subtitle: 'Turn your dreams into interactive narratives with AI',
      cta: 'Create my first story',
      badge: 'AI Image Generator',
      heading1: 'Transform your ideas into',
      heading2: 'amazing images',
      description: 'Create unique images with artificial intelligence. Simple, fast and powerful.',
      ctaButton: 'Create Image Now'
    },
    trending: {
      title: 'Trending',
      subtitle: 'The most popular stories of the week'
    },
    new: {
      title: 'New Stories',
      subtitle: 'The latest creations from the community'
    },
    featured: {
      badge: 'MOST POPULAR',
      reads: 'reads'
    }
  },
  create: {
    title: 'Generate Your Story',
    subtitle: 'Describe your dream and AI will turn it into a unique visual story',
    titleLabel: 'Story title',
    titlePlaceholder: 'E.g: The Last Time Guardian',
    titleRequired: 'Title (required)',
    prompt: {
      label: 'What\'s your fantasy today?',
      placeholder: 'Example: A space warrior discovers a forgotten planet where music controls reality...'
    },
    style: {
      label: 'Visual Style',
      anime: 'Anime',
      realistic: 'Realistic',
      noir: 'Noir',
      watercolor: 'Watercolor',
      comic: 'Comic',
      fantasy: 'Fantasy'
    },
    genre: {
      label: 'Genre',
      romance: 'Romance',
      action: 'Action',
      mystery: 'Mystery',
      scifi: 'Sci-Fi',
      horror: 'Horror',
      fantasy: 'Fantasy'
    },
    characters: {
      label: 'Characters',
      subtitle: 'Add photos and names',
      optional: 'Optional',
      addCharacter: 'Add Character',
      namePlaceholder: 'Character name',
      descriptionPlaceholder: 'Character description: age, appearance, clothing, physical characteristics...',
      limit: 'max',
      freePlan: 'Free: 2 max',
      premiumPlan: 'Premium: 10 max',
      limitReached: 'Limit Reached (Free Plan)',
      limitDesc: 'You\'ve reached the maximum of 2 characters. Upgrade to Premium to use up to 10 characters per story.',
      upgradeToPremium: 'Upgrade to Premium',
      premiumLimitDesc: 'You\'ve reached the maximum of 10 characters per story'
    },
    visibility: {
      label: 'Story visibility',
      public: 'Public',
      publicDesc: 'Everyone can see it',
      private: 'Private',
      privateDesc: 'Only you will see it'
    },
    advancedOptions: {
      title: 'Advanced Options',
      genderLabel: 'Character Gender',
      female: 'Female',
      male: 'Male',
      bodyTypeLabel: 'Body Type',
      femaleBody: 'Feminine',
      maleBody: 'Masculine',
      poseLabel: 'Character Pose Reference',
      poseUpload: 'Click to upload a pose reference',
      poseMaxSize: 'PNG, JPG (max. 5MB)',
      poseDescription: 'Upload a reference image showing the desired pose for your character'
    },
    generate: 'MATERIALIZE',
    generating: 'CREATING MAGIC...',
    features: {
      instant: 'Instant generation',
      unique: '100% unique and personalized',
      unlimited: 'Unlimited possibilities'
    }
  },
  search: {
    title: 'Discover Stories',
    placeholder: 'Search stories, authors, genres...',
    filters: 'Filters',
    tags: 'Tags',
    visualStyle: 'Visual Style',
    sortBy: 'Sort by',
    sort: {
      popular: 'Most popular',
      recent: 'Most recent',
      trending: 'Trending'
    },
    results: 'results',
    noResults: 'No stories found',
    tryDifferent: 'Try different search terms'
  },
  imageGenerator: {
    title: 'AI Image Generator',
    subtitle: 'Create unique images with artificial intelligence',
    step1: '1. Upload your reference image',
    step2: '2. Generation Options',
    promptLabel: 'Prompt (Description)',
    promptRequired: '*',
    promptPlaceholder: 'Example: a woman with long curly hair, smiling, in a garden with flowers...',
    promptTip: '💡 Describe in detail how you want the image to be',
    negativePromptLabel: 'Negative Prompt (What to avoid)',
    negativePromptPlaceholder: 'Example: blurry, low quality, distorted, poorly drawn...',
    negativePromptTip: '💡 Define which elements you don\'t want in the image',
    generateButton: 'Generate Image',
    generating: 'Generating Image...'
  },
  profile: {
    stats: {
      title: 'Profile Information',
      memberSince: 'Member since',
      email: 'Email',
      stories: 'Stories',
      followers: 'Followers',
      following: 'Following',
      totalLikes: 'Likes'
    },
    tabs: {
      myStories: 'My Stories',
      saved: 'Saved',
      liked: 'Liked',
      images: 'Images'
    },
    empty: {
      noStories: 'You haven\'t created any stories yet',
      createFirst: 'Create your first story',
      noSaved: 'You have no saved stories',
      noLiked: 'You haven\'t liked any stories',
      explore: 'Explore stories',
      noImages: 'You haven\'t generated any images yet',
      generateFirst: 'Generate your first image'
    },
    credits: {
      freeImages: 'Free images',
      resetIn: 'Resets in:',
      referralCode: 'Referral code',
      copy: 'Copy',
      referralDesc: '+3 images per invited friend',
      referrals: 'referrals',
      referralCopied: 'Referral link copied!'
    },
    premium: {
      active: 'Premium Active',
      features: 'Unlimited images • No watermarks',
      manage: 'Manage'
    },
    edit: {
      editProfile: 'Edit profile',
      saveChanges: 'Save changes',
      username: 'Username',
      bio: 'Bio',
      bioPlaceholder: 'Bio (optional)',
      noBio: 'No bio'
    },
    avatar: {
      uploading: 'Uploading...',
      errorFormat: 'Please select a valid image',
      errorSize: 'Image must be smaller than 5MB'
    },
    logout: 'Sign out'
  },
  settings: {
    title: 'Settings',
    account: {
      title: 'Account',
      username: 'Username',
      email: 'Email',
      bio: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      changePassword: 'Change password',
      saved: 'Profile updated successfully',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordUpdated: 'Password updated successfully',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      update: 'Update',
      saveChanges: 'Save changes'
    },
    preferences: {
      title: 'Preferences',
      notifications: 'Push notifications',
      notificationsDesc: 'Receive updates about your stories',
      language: 'Language',
      languageDesc: 'Select your preferred language'
    },
    premium: {
      title: 'DreamDuel Premium',
      description: 'Unlock exclusive features',
      features: {
        unlimited: 'Unlimited generation',
        priority: 'Priority processing',
        styles: 'Exclusive styles',
        commercial: 'Commercial use',
        noAds: 'No ads',
        exclusiveStyles: 'Exclusive visual styles'
      },
      cta: 'Upgrade to Premium',
      upgradeButton: 'Upgrade to Premium',
      price: '$9.99/month'
    },
    legal: {
      title: 'Legal & Support',
      terms: 'Terms and Conditions',
      privacy: 'Privacy Policy',
      help: 'Help Center',
      about: 'About DreamDuel'
    },
    logout: 'Sign out',
    confirmLogout: 'Are you sure you want to sign out?'
  },
  story: {
    readNow: 'Read Now',
    readStory: 'Read Story',
    like: 'Like',
    save: 'Save',
    author: 'Author',
    follow: 'Follow',
    scenes: 'Scenes from this story',
    scene: 'Scene',
    stats: {
      views: 'views',
      likes: 'likes',
      comments: 'comments'
    }
  },
  viewer: {
    ready: 'Your story is ready!',
    subtitle: 'You can now read it or share it with the world',
    actions: {
      read: 'Read Now',
      details: 'View Details',
      create: 'Create Another'
    },
    backHome: 'Back to home'
  },
  loading: {
    messages: [
      'Creating worlds...',
      'Generating characters...',
      'Weaving the plot...',
      'Bringing your story to life...'
    ]
  },
  onboarding: {
    slides: [
      {
        title: 'Create Unique Stories',
        description: 'Describe your fantasy and AI will generate a personalized visual story'
      },
      {
        title: 'Customize Characters',
        description: 'Upload photos of your favorite characters and bring them to life in your story'
      },
      {
        title: 'Discover Infinite Stories',
        description: 'Explore creations from other users and find your next favorite read'
      },
      {
        title: 'Start Dreaming!',
        description: 'Join thousands of creators and readers on DreamDuel'
      }
    ]
  },
  guest: {
    header: {
      login: 'Log In',
      register: 'Sign Up Free'
    },
    hero: {
      title: 'Transform Your Photo with AI',
      subtitle: 'Upload a photo and describe what you want to do with it. Try it free without registration!',
      features: {
        noCard: 'No card required',
        instant: 'Instant',
        free: '100% free'
      }
    },
    steps: {
      uploadImage: 'Upload a photo of a person',
      uploadClick: 'Click to upload an image',
      maxSize: 'PNG, JPG (max. 5MB)',
      promptLabel: 'Describe what you want to create',
      promptDescription: 'PROMPT - Describe what you want to see',
      promptPlaceholder: 'Example: a person on the beach at sunset, wearing sportswear swimsuit, relaxed pose, background with palm trees and ocean waves...',
      promptExample: 'Describe in detail: scenery, clothing, pose, lighting, atmosphere...',
      negativePromptDescription: 'NEGATIVE PROMPT - Describe what you DON\'T want to see (Optional)',
      negativePromptPlaceholder: 'Example: low quality, blurry, distorted, disfigured, extra hands, malformed face...',
      negativePromptExample: 'Indicate which elements you want to avoid in the generated image',
      customizePhysical: 'Customize physical characteristics (Optional)',
      customizeDesc: 'Select physical characteristics to transform the person in the photo',
      finalDescription: 'Final Description (Auto-generated)',
      additionalDetails: 'Add additional details: scenery, environment, accessories, special effects...',
      additionalExample: 'Example: "on a beach at sunset with palm trees in the background"',
      finalPrompt: 'Final Prompt (will be sent to AI):',
      selectOrWrite: 'Select options or write a description...',
      advancedOptions: 'Advanced Options',
      poseLabelLocked: 'Character Pose Reference',
      registerRequired: 'Registration Required',
      poseUploadLocked: 'Upload a pose reference image',
      registerToUnlock: 'Register to unlock',
      registerToUnlockButton: 'Sign Up to Unlock',
      poseExample: 'Upload an image showing the desired character pose',
      genderLabel: 'Character Gender',
      female: 'Female',
      male: 'Male',
      genderDescription: 'Select the gender for your generated character',
      bodyTypeLabel: 'Body Type',
      femaleBody: 'Feminine',
      maleBody: 'Masculine',
      bodyTypeDescription: 'Choose the body type for your character'
    },
    physicalOptions: {
      gender: 'Gender / Features',
      ageRange: 'Age Range',
      bodyType: 'Body Type',
      muscleDefinition: 'Muscle Definition',
      height: 'Height',
      clothing: 'Clothing',
      poseAction: 'Action / Pose'
    },
    bodyTypes: {
      athletic: '💪 Athletic',
      slim: '🏃 Slim',
      average: '🧍 Average',
      robust: '🏋️ Robust',
      curvy: '💃 Curvy',
      muscular: '🦾 Muscular'
    },
    muscles: {
      defined: '💎 Defined Muscles',
      toned: '⚡ Toned',
      normal: '➖ Normal'
    },
    heights: {
      tall: '📏 Tall',
      average: '📐 Average Height',
      short: '📌 Short'
    },
    clothing: {
      sport: '⚽ Sportswear',
      casual: '👕 Casual',
      formal: '👔 Formal',
      swimsuit: '🩱 Swimsuit',
      superhero: '🦸 Superhero',
      elegant: '🎩 Elegant Gala',
      streetwear: '🧥 Streetwear'
    },
    poses: {
      standing: '🧍 Standing',
      sitting: '🪑 Sitting',
      lying: '🛋️ Lying Down',
      selfie: '🤳 Taking Selfie',
      running: '🏃 Running',
      jumping: '🦘 Jumping',
      powerPose: '💪 Power Pose',
      crossedArms: '🙅 Crossed Arms',
      meditating: '🧘 Meditating',
      dancing: '💃 Dancing'
    },
    generate: {
      button: 'GENERATE IMAGE FREE',
      generating: 'CREATING YOUR IMAGE...',
      uploadRequired: '⚠️ Upload a photo to continue',
      descRequired: '⚠️ Describe what you want to do with the photo'
    },
    benefits: {
      title: '✨ Sign up and get:',
      freeImages: '3 Free Images',
      freeDesc: 'Welcome pack',
      saveCreations: 'Save Creations',
      saveDesc: 'Access from anywhere',
      inviteFriends: 'Invite Friends',
      inviteDesc: '+3 credits per referral'
    },
    modal: {
      ready: 'Your image is ready!',
      subtitle: 'Sign up for free to save it and create more amazing images',
      registerButton: 'Sign Up Free',
      haveAccount: 'I already have an account',
      noCard: 'No card required • Cancel anytime'
    }
  },
  auth: {
    login: {
      title: 'Log In',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      button: 'Log In',
      noAccount: 'Don\'t have an account?',
      signUp: 'Sign up',
      welcome: 'Welcome back',
      subtitle: 'Continue creating amazing stories',
      orLoginWith: 'Or log in with',
      continueWithGoogle: 'Continue with Google',
      google: 'Google',
      apple: 'Apple',
      creating: 'Logging in...'
    },
    register: {
      title: 'Create Account',
      username: 'Username',
      usernamePlaceholder: 'username123',
      email: 'Email',
      emailPlaceholder: 'your.email.com',
      password: 'Password',
      passwordPlaceholder: 'Minimum 8 characters',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Confirm your password',
      button: 'Create Account',
      creating: 'Creating account...',
      haveAccount: 'Already have an account?',
      signIn: 'Log in',
      joinCommunity: 'Join the creator community',
      acceptTerms: 'I accept the',
      terms: 'terms and conditions',
      and: 'and the',
      privacy: 'privacy policy',
      orRegisterWith: 'Or sign up with',
      continueWithGoogle: 'Continue with Google',
      referralBonus: 'Referral Bonus!',
      referralDesc: 'You will get +3 free images when you sign up',
      errorPasswordMismatch: 'Passwords do not match',
      errorAcceptTerms: 'You must accept the terms and conditions',
      footer: '© 2026 DreamDuel. All rights reserved.'
    }
  },
  legal: {
    terms: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated',
      contact: 'Contact',
      section1: {
        title: 'Acceptance of Terms',
        content: 'By accessing and using DreamDuel, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our service.'
      },
      section2: {
        title: 'Service Description',
        content: 'DreamDuel is an AI-powered image generation service. Users pay $1 per generated image and download it directly. We do not store generated images on our servers. We reserve the right to modify or discontinue the service at any time.'
      },
      section3: {
        title: 'User Account',
        content: 'You are responsible for maintaining the confidentiality of your account and password. You accept responsibility for all activities that occur under your account. You must be at least 13 years old to use this service.'
      },
      section4: {
        title: 'Generated Images and Rights',
        content: 'Images generated through our service are downloaded directly by you and are not stored on our servers. You retain all rights to the images you generate and download. You are responsible for the use of generated images and must ensure you do not infringe on third-party rights.'
      },
      section5: {
        title: 'Prohibited Conduct',
        content: 'You must not use DreamDuel to generate illegal, offensive, harassing, violent, pornographic content, or content that infringes on third-party rights. We reserve the right to suspend or terminate accounts that violate these terms. Use of the service must comply with all applicable laws.'
      },
      section6: {
        title: 'Intellectual Property',
        content: 'All content, features, and functionality of the service are the exclusive property of DreamDuel and are protected by copyright, trademarks, and other intellectual property laws.'
      },
      section7: {
        title: 'Limitation of Liability',
        content: 'DreamDuel is provided "as is" without warranties of any kind. We will not be liable for indirect, incidental, or consequential damages resulting from the use or inability to use the service.'
      }
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated',
      contact: 'Contact',
      section1: {
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as your name and email. We do not store the images you generate, as they are downloaded directly to your device. We also automatically collect information about your use of the service, including IP address, browser type, and pages visited.'
      },
      section2: {
        title: 'Use of Information',
        content: 'We use your information to provide and maintain the image generation service, process payments through PayPal, send you transaction confirmations, improve our service, and protect platform security. We do not use the images you generate for any purpose as we do not store them.'
      },
      section3: {
        title: 'Sharing Information',
        content: 'We do not sell your personal information. We may share your information with service providers who help us operate the platform, when required by law, or with your consent.'
      },
      section4: {
        title: 'Cookies and Similar Technologies',
        content: 'We use cookies and similar technologies to remember your preferences, understand how you use the service, and improve your experience. You can set your browser to reject cookies, but this may affect service functionality.'
      },
      section5: {
        title: 'Data Security',
        content: 'We implement technical and organizational security measures to protect your personal information. However, no method of Internet transmission is 100% secure, so we cannot guarantee absolute security.'
      },
      section6: {
        title: 'Your Rights',
        content: 'You have the right to access, correct, delete, or transfer your personal information. You may also object to the processing of your data or request its limitation. Contact us to exercise these rights.'
      }
    }
  }
};
