export interface ValidationResult {
  isValid: boolean;
  score: number;
  maxScore: number;
  percentage: number;
  checks: ValidationCheck[];
  overallStatus: 'valid' | 'suspicious' | 'invalid';
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  score: number;
  maxScore: number;
  details: string;
}

export interface DocumentValidationOptions {
  documentType: 'statutory-declaration' | 'ghana-card' | 'birth-certificate' | 'marriage-certificate';
  file: File;
  passThreshold?: number;
}

class DocumentValidator {
  private readonly DEFAULT_PASS_THRESHOLD = 70;

  async validateDocument(options: DocumentValidationOptions): Promise<ValidationResult> {
    const { documentType, file, passThreshold = this.DEFAULT_PASS_THRESHOLD } = options;
    
    try {
      const text = await this.extractTextFromFile(file);
      
      switch (documentType) {
        case 'statutory-declaration':
          return this.validateStatutoryDeclaration(text, passThreshold);
        case 'ghana-card':
          return this.validateGhanaCard(text, passThreshold);
        case 'birth-certificate':
          return this.validateBirthCertificate(text, passThreshold);
        case 'marriage-certificate':
          return this.validateMarriageCertificate(text, passThreshold);
        default:
          throw new Error(`Unsupported document type: ${documentType}`);
      }
    } catch (error) {
      console.error('Document validation error:', error);
      return {
        isValid: false,
        score: 0,
        maxScore: 100,
        percentage: 0,
        checks: [],
        overallStatus: 'invalid'
      };
    }
  }

  private async extractTextFromFile(file: File): Promise<string> {
    // For now, we'll simulate text extraction
    // In a real implementation, you would use libraries like PDF.js, Tesseract.js, etc.
    
    // Simulate different document contents based on file name
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('statutory') || fileName.includes('declaration')) {
      return this.getSampleStatutoryDeclarationText();
    } else if (fileName.includes('ghana') && fileName.includes('card')) {
      return this.getSampleGhanaCardText();
    } else if (fileName.includes('birth') && fileName.includes('certificate')) {
      return this.getSampleBirthCertificateText();
    } else if (fileName.includes('marriage') && fileName.includes('certificate')) {
      return this.getSampleMarriageCertificateText();
    }
    
    // Default sample text
    return this.getSampleStatutoryDeclarationText();
  }

  private validateStatutoryDeclaration(text: string, passThreshold: number): ValidationResult {
    const checks: ValidationCheck[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Heading Check (20 pts)
    const headingCheck = this.checkHeading(text);
    checks.push(headingCheck);
    totalScore += headingCheck.score;
    maxScore += headingCheck.maxScore;

    // Sworn Statement Check (25 pts)
    const swornCheck = this.checkSwornStatement(text);
    checks.push(swornCheck);
    totalScore += swornCheck.score;
    maxScore += swornCheck.maxScore;

    // Commissioner Check (25 pts)
    const commissionerCheck = this.checkCommissioner(text);
    checks.push(commissionerCheck);
    totalScore += commissionerCheck.score;
    maxScore += commissionerCheck.maxScore;

    // Seal Check (15 pts)
    const sealCheck = this.checkSeal(text);
    checks.push(sealCheck);
    totalScore += sealCheck.score;
    maxScore += sealCheck.maxScore;

    // Declaration Format Check (15 pts)
    const declarationCheck = this.checkDeclarationFormat(text);
    checks.push(declarationCheck);
    totalScore += declarationCheck.score;
    maxScore += declarationCheck.maxScore;

    const percentage = (totalScore / maxScore) * 100;
    const isValid = percentage >= passThreshold;
    
    return {
      isValid,
      score: totalScore,
      maxScore,
      percentage,
      checks,
      overallStatus: this.getOverallStatus(percentage, passThreshold)
    };
  }

  private validateGhanaCard(text: string, passThreshold: number): ValidationResult {
    const checks: ValidationCheck[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Valid card number format (40 pts)
    const cardNumberCheck = this.checkGhanaCardNumber(text);
    checks.push(cardNumberCheck);
    totalScore += cardNumberCheck.score;
    maxScore += cardNumberCheck.maxScore;

    // NIA reference (30 pts)
    const niaCheck = this.checkNIAReference(text);
    checks.push(niaCheck);
    totalScore += niaCheck.score;
    maxScore += niaCheck.maxScore;

    // Ghana identifier (30 pts)
    const ghanaIdCheck = this.checkGhanaIdentifier(text);
    checks.push(ghanaIdCheck);
    totalScore += ghanaIdCheck.score;
    maxScore += ghanaIdCheck.maxScore;

    const percentage = (totalScore / maxScore) * 100;
    const isValid = percentage >= passThreshold;
    
    return {
      isValid,
      score: totalScore,
      maxScore,
      percentage,
      checks,
      overallStatus: this.getOverallStatus(percentage, passThreshold)
    };
  }

  private validateBirthCertificate(text: string, passThreshold: number): ValidationResult {
    const checks: ValidationCheck[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Certificate heading (35 pts)
    const headingCheck = this.checkBirthCertificateHeading(text);
    checks.push(headingCheck);
    totalScore += headingCheck.score;
    maxScore += headingCheck.maxScore;

    // Registrar signature (35 pts)
    const registrarCheck = this.checkRegistrarSignature(text);
    checks.push(registrarCheck);
    totalScore += registrarCheck.score;
    maxScore += registrarCheck.maxScore;

    // Date of birth info (30 pts)
    const dobCheck = this.checkDateOfBirthInfo(text);
    checks.push(dobCheck);
    totalScore += dobCheck.score;
    maxScore += dobCheck.maxScore;

    const percentage = (totalScore / maxScore) * 100;
    const isValid = percentage >= passThreshold;
    
    return {
      isValid,
      score: totalScore,
      maxScore,
      percentage,
      checks,
      overallStatus: this.getOverallStatus(percentage, passThreshold)
    };
  }

  private validateMarriageCertificate(text: string, passThreshold: number): ValidationResult {
    const checks: ValidationCheck[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Certificate heading (30 pts)
    const headingCheck = this.checkMarriageCertificateHeading(text);
    checks.push(headingCheck);
    totalScore += headingCheck.score;
    maxScore += headingCheck.maxScore;

    // Marriage details (40 pts)
    const marriageDetailsCheck = this.checkMarriageDetails(text);
    checks.push(marriageDetailsCheck);
    totalScore += marriageDetailsCheck.score;
    maxScore += marriageDetailsCheck.maxScore;

    // Official signature (30 pts)
    const signatureCheck = this.checkMarriageSignature(text);
    checks.push(signatureCheck);
    totalScore += signatureCheck.score;
    maxScore += signatureCheck.maxScore;

    const percentage = (totalScore / maxScore) * 100;
    const isValid = percentage >= passThreshold;
    
    return {
      isValid,
      score: totalScore,
      maxScore,
      percentage,
      checks,
      overallStatus: this.getOverallStatus(percentage, passThreshold)
    };
  }

  // Statutory Declaration Checks
  private checkHeading(text: string): ValidationCheck {
    const hasStatutoryDeclaration = /STATUTORY\s+DECLARATION/i.test(text);
    const hasRepublicOfGhana = /REPUBLIC\s+OF\s+GHANA/i.test(text);
    
    let score = 0;
    if (hasStatutoryDeclaration) score += 10;
    if (hasRepublicOfGhana) score += 10;
    
    return {
      name: 'Document Heading',
      passed: score >= 15,
      score,
      maxScore: 20,
      details: hasStatutoryDeclaration && hasRepublicOfGhana 
        ? 'Both "STATUTORY DECLARATION" and "Republic of Ghana" found'
        : hasStatutoryDeclaration 
        ? 'Only "STATUTORY DECLARATION" found'
        : hasRepublicOfGhana
        ? 'Only "Republic of Ghana" found'
        : 'Required headings not found'
    };
  }

  private checkSwornStatement(text: string): ValidationCheck {
    const hasSwornAt = /SWORN\s+AT/i.test(text);
    const hasSwornBefore = /SWORN\s+BEFORE/i.test(text);
    const hasMadeOath = /MADE\s+OATH/i.test(text);
    
    let score = 0;
    if (hasSwornAt) score += 8;
    if (hasSwornBefore) score += 8;
    if (hasMadeOath) score += 9;
    
    return {
      name: 'Sworn Statement',
      passed: score >= 20,
      score,
      maxScore: 25,
      details: `Found ${[hasSwornAt && 'Sworn At', hasSwornBefore && 'Sworn Before', hasMadeOath && 'Made Oath'].filter(Boolean).join(', ')}`
    };
  }

  private checkCommissioner(text: string): ValidationCheck {
    const hasCommissioner = /COMMISSIONER\s+FOR\s+OATHS/i.test(text);
    const hasSignature = /SIGNATURE/i.test(text) || /SIGNED/i.test(text);
    
    let score = 0;
    if (hasCommissioner) score += 15;
    if (hasSignature) score += 10;
    
    return {
      name: 'Commissioner for Oaths',
      passed: score >= 20,
      score,
      maxScore: 25,
      details: hasCommissioner && hasSignature 
        ? 'Commissioner for Oaths and signature found'
        : hasCommissioner
        ? 'Commissioner for Oaths found but no signature'
        : 'Commissioner for Oaths not found'
    };
  }

  private checkSeal(text: string): ValidationCheck {
    const hasSeal = /SEAL/i.test(text) || /OFFICIAL\s+SEAL/i.test(text) || /STAMP/i.test(text);
    
    return {
      name: 'Official Seal',
      passed: hasSeal,
      score: hasSeal ? 15 : 0,
      maxScore: 15,
      details: hasSeal ? 'Official seal or stamp found' : 'No official seal or stamp found'
    };
  }

  private checkDeclarationFormat(text: string): ValidationCheck {
    const hasSolemnlyDeclare = /I\s+SOLEMNLY\s+DECLARE/i.test(text);
    const hasDeclaration = /DECLARE/i.test(text);
    
    let score = 0;
    if (hasSolemnlyDeclare) score += 15;
    else if (hasDeclaration) score += 8;
    
    return {
      name: 'Declaration Format',
      passed: score >= 10,
      score,
      maxScore: 15,
      details: hasSolemnlyDeclare 
        ? 'Proper "I solemnly declare" format found'
        : hasDeclaration
        ? 'Declaration format partially found'
        : 'No declaration format found'
    };
  }

  // Ghana Card Checks
  private checkGhanaCardNumber(text: string): ValidationCheck {
    const ghanaCardPattern = /GHA-\d{9}-\d/i;
    const hasValidFormat = ghanaCardPattern.test(text);
    
    return {
      name: 'Personal ID Number Format',
      passed: hasValidFormat,
      score: hasValidFormat ? 40 : 0,
      maxScore: 40,
      details: hasValidFormat 
        ? 'Valid Personal ID Number format (GHA-XXXXXXXXX-X) found'
        : 'Invalid or missing Personal ID Number format'
    };
  }

  private checkNIAReference(text: string): ValidationCheck {
    const hasECOWAS = /ECOWAS/i.test(text) || /CEDEAO/i.test(text);
    const hasIdentityCard = /IDENTITY\s+CARD/i.test(text) || /CARTE\s+D'\s+IDENTITE/i.test(text);
    const hasRepublicOfGhana = /REPUBLIC\s+OF\s+GHANA/i.test(text);
    
    let score = 0;
    if (hasECOWAS) score += 10;
    if (hasIdentityCard) score += 10;
    if (hasRepublicOfGhana) score += 10;
    
    return {
      name: 'ECOWAS Card Header',
      passed: score >= 20,
      score,
      maxScore: 30,
      details: `Found: ${[hasECOWAS && 'ECOWAS', hasIdentityCard && 'Identity Card', hasRepublicOfGhana && 'Republic of Ghana'].filter(Boolean).join(', ')}`
    };
  }

  private checkGhanaIdentifier(text: string): ValidationCheck {
    const hasSurname = /SURNAME|NOM/i.test(text);
    const hasFirstnames = /FIRSTNAMES|PRENOMS/i.test(text);
    const hasNationality = /NATIONALITY|NATIONALITE/i.test(text);
    const hasDateOfBirth = /DATE\s+OF\s+BIRTH|DATE\s+DE\s+NAISSANCE/i.test(text);
    const hasSex = /SEX|SEXE/i.test(text);
    const hasHeight = /HEIGHT|TAILLE/i.test(text);
    const hasDocumentNumber = /DOCUMENT\s+NUMBER|NUMERO\s+DU\s+DOCUMENT/i.test(text);
    const hasPlaceOfIssuance = /PLACE\s+OF\s+ISSUANCE|LIEU\s+DE\s+DELIVRANCE/i.test(text);
    const hasDateOfIssuance = /DATE\s+OF\s+ISSUANCE|DATE\s+D'\s+EMISSION/i.test(text);
    const hasDateOfExpiry = /DATE\s+OF\s+EXPIRY|DATE\s+D'\s+EXPIRATION/i.test(text);
    
    let score = 0;
    const checks = [hasSurname, hasFirstnames, hasNationality, hasDateOfBirth, hasSex, hasHeight, hasDocumentNumber, hasPlaceOfIssuance, hasDateOfIssuance, hasDateOfExpiry];
    score = checks.filter(Boolean).length * 3; // 3 points per field found
    
    return {
      name: 'Card Information Fields',
      passed: score >= 20,
      score,
      maxScore: 30,
      details: `Found ${checks.filter(Boolean).length}/10 required fields: ${[
        hasSurname && 'Surname', hasFirstnames && 'Firstnames', hasNationality && 'Nationality', 
        hasDateOfBirth && 'Date of Birth', hasSex && 'Sex', hasHeight && 'Height',
        hasDocumentNumber && 'Document Number', hasPlaceOfIssuance && 'Place of Issuance',
        hasDateOfIssuance && 'Date of Issuance', hasDateOfExpiry && 'Date of Expiry'
      ].filter(Boolean).join(', ')}`
    };
  }

  // Birth Certificate Checks
  private checkBirthCertificateHeading(text: string): ValidationCheck {
    const hasBirth = /BIRTH/i.test(text);
    const hasCertificate = /CERTIFICATE/i.test(text);
    const hasGhana = /GHANA/i.test(text);
    
    let score = 0;
    if (hasBirth) score += 12;
    if (hasCertificate) score += 12;
    if (hasGhana) score += 11;
    
    return {
      name: 'Birth Certificate Heading',
      passed: score >= 25,
      score,
      maxScore: 35,
      details: `Found: ${[hasBirth && 'Birth', hasCertificate && 'Certificate', hasGhana && 'Ghana'].filter(Boolean).join(', ')}`
    };
  }

  private checkRegistrarSignature(text: string): ValidationCheck {
    const hasRegistrar = /REGISTRAR/i.test(text);
    const hasSignature = /SIGNATURE/i.test(text) || /SIGNED/i.test(text);
    
    let score = 0;
    if (hasRegistrar) score += 18;
    if (hasSignature) score += 17;
    
    return {
      name: 'Registrar Signature',
      passed: score >= 25,
      score,
      maxScore: 35,
      details: hasRegistrar && hasSignature 
        ? 'Registrar and signature found'
        : hasRegistrar
        ? 'Registrar found but no signature'
        : 'Registrar signature not found'
    };
  }

  private checkDateOfBirthInfo(text: string): ValidationCheck {
    const hasDateOfBirth = /DATE\s+OF\s+BIRTH/i.test(text) || /BORN/i.test(text);
    const hasDate = /\d{1,2}\/\d{1,2}\/\d{4}/.test(text) || /\d{1,2}-\d{1,2}-\d{4}/.test(text);
    
    let score = 0;
    if (hasDateOfBirth) score += 15;
    if (hasDate) score += 15;
    
    return {
      name: 'Date of Birth Information',
      passed: score >= 20,
      score,
      maxScore: 30,
      details: hasDateOfBirth && hasDate 
        ? 'Date of birth label and date found'
        : hasDateOfBirth
        ? 'Date of birth label found but no date'
        : 'Date of birth information not found'
    };
  }

  // Marriage Certificate Checks
  private checkMarriageCertificateHeading(text: string): ValidationCheck {
    const hasMarriage = /MARRIAGE/i.test(text);
    const hasCertificate = /CERTIFICATE/i.test(text);
    
    let score = 0;
    if (hasMarriage) score += 15;
    if (hasCertificate) score += 15;
    
    return {
      name: 'Marriage Certificate Heading',
      passed: score >= 20,
      score,
      maxScore: 30,
      details: hasMarriage && hasCertificate 
        ? 'Marriage Certificate heading found'
        : 'Marriage Certificate heading incomplete'
    };
  }

  private checkMarriageDetails(text: string): ValidationCheck {
    const hasBride = /BRIDE/i.test(text);
    const hasGroom = /GROOM/i.test(text);
    const hasDate = /\d{1,2}\/\d{1,2}\/\d{4}/.test(text);
    
    let score = 0;
    if (hasBride) score += 13;
    if (hasGroom) score += 13;
    if (hasDate) score += 14;
    
    return {
      name: 'Marriage Details',
      passed: score >= 30,
      score,
      maxScore: 40,
      details: `Found: ${[hasBride && 'Bride', hasGroom && 'Groom', hasDate && 'Date'].filter(Boolean).join(', ')}`
    };
  }

  private checkMarriageSignature(text: string): ValidationCheck {
    const hasOfficial = /OFFICIAL/i.test(text) || /REGISTRAR/i.test(text);
    const hasSignature = /SIGNATURE/i.test(text) || /SIGNED/i.test(text);
    
    let score = 0;
    if (hasOfficial) score += 15;
    if (hasSignature) score += 15;
    
    return {
      name: 'Official Signature',
      passed: score >= 20,
      score,
      maxScore: 30,
      details: hasOfficial && hasSignature 
        ? 'Official signature found'
        : hasOfficial
        ? 'Official found but no signature'
        : 'Official signature not found'
    };
  }

  private getOverallStatus(percentage: number, passThreshold: number): 'valid' | 'suspicious' | 'invalid' {
    if (percentage >= passThreshold) return 'valid';
    if (percentage >= passThreshold * 0.7) return 'suspicious';
    return 'invalid';
  }

  // Sample document texts for testing
  private getSampleStatutoryDeclarationText(): string {
    return `
      STATUTORY DECLARATION
      Republic of Ghana
      
      I, John Doe, of Accra, do solemnly declare that:
      
      I am the person named in the above application and I wish to change my name from John Doe to John Smith.
      
      I solemnly declare that the above statement is true to the best of my knowledge and belief.
      
      Sworn at Accra this 15th day of January 2024
      Before me: Commissioner for Oaths
      
      Signature: ________________
      Official Seal: [SEAL]
    `;
  }

  private getSampleGhanaCardText(): string {
    return `
      ECOWAS IDENTITY CARD
      CARTE D' IDENTITE CEDEAO / BILHETE DE IDENTIDADE CEDEAO
      REPUBLIC OF GHANA
      
      Surname/Nom: OPPONG
      Firstnames/Prénoms: MORRISON
      Previous Name(s)/Noms Précédents: 
      Nationality/Nationalité: GHANAIAN
      Date of Birth/Date de Naissance: 12/11/1996
      Personal ID Number: GHA-724693385-3
      Sex/Sexe: M
      Height/Taille(m): 1.7
      Document Number/Numéro du document: AQ8497325
      Place of Issuance/Lieu de délivrance: ACCRA
      Date of Issuance/Date d'émission: 03/08/2020
      Date of Expiry/Date d'expiration: 02/08/2030
      
      Card Number: 692123
    `;
  }

  private getSampleBirthCertificateText(): string {
    return `
      BIRTH CERTIFICATE
      Republic of Ghana
      
      This is to certify that John Doe was born on 15th January 1990
      at Accra, Greater Accra Region, Ghana
      
      Date of Birth: 15/01/1990
      Place of Birth: Accra
      
      Registrar's Signature: ________________
      Date: 20/01/1990
    `;
  }

  private getSampleMarriageCertificateText(): string {
    return `
      MARRIAGE CERTIFICATE
      Republic of Ghana
      
      This is to certify that John Doe (Groom) and Jane Smith (Bride)
      were married on 15th June 2020 at Accra, Ghana
      
      Marriage Date: 15/06/2020
      Place: Accra
      
      Official Signature: ________________
      Registrar: ________________
    `;
  }
}

export const documentValidator = new DocumentValidator();
