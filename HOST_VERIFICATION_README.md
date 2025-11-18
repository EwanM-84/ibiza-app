# Host Verification System

## Overview

The SPTC Rural host verification system implements comprehensive security measures including identity verification, biometric authentication, document scanning, and background checks to ensure host authenticity and platform safety.

## Security Features

### 1. Multi-Step Registration Process

**Step 1: Basic Information**
- Full name
- Email address (verified)
- Secure password with strength validation
- Minimum 8 characters, uppercase, lowercase, numbers, special characters

**Step 2: Contact Details**
- Phone number verification
- Location information (country, city)
- Age verification (must be 18+)

**Step 3: Terms & Consent**
- Terms of Service agreement
- Background check consent
- Biometric data processing consent (GDPR/Privacy compliant)

### 2. Identity Verification (Onboarding Step 1)

**Document Upload**
- Supported documents: Passport, National ID, Driver's License
- Automatic OCR (Optical Character Recognition)
- Document authenticity checks
- Expiry date validation
- Security features detection (watermarks, holograms)

**Integration Options:**
- Jumio (recommended for Latin America)
- Onfido (global coverage)
- Stripe Identity (payment + verification)
- Persona (flexible workflows)

### 3. Biometric Verification (Onboarding Step 2)

**Face Recognition**
- Real-time camera capture
- Selfie verification
- Face matching with ID document photo
- Confidence score: 95%+ required

**Liveness Detection**
- Prevents photo/video spoofing
- Blink detection
- Head movement verification
- 3D depth analysis (on supported devices)

### 4. Property Verification (Onboarding Step 3)

**GPS-Verified Photos**
- Minimum 5 property photos required
- GPS coordinates captured with each photo
- Location accuracy verification
- Timestamp validation
- Device metadata logging

**Anti-Fraud Measures:**
- Prevents using stock photos (reverse image search)
- Verifies photos taken at claimed location
- Checks for GPS coordinate manipulation
- Validates recent photo timestamps

### 5. Background Checks

**Automatic Checks:**
- Criminal record verification
- Sex offender registry check
- Fraud database cross-reference
- Previous platform bans

**Manual Review:**
- Admin review of flagged accounts
- Property ownership verification
- Reference checks for high-value listings

## Database Schema

### Tables

1. **host_profiles** - Main host account data
2. **property_verifications** - GPS-verified property photos
3. **verification_attempts** - Audit log of all verification attempts
4. **host_banking_info** - Encrypted payment information
5. **host_security_flags** - Security incidents and fraud flags

See `database/host_verification_schema.sql` for complete schema.

## API Endpoints

### POST /api/verification/document
Verify identity documents with facial recognition

**Request:**
```json
{
  "documentType": "passport",
  "documentFrontImage": "base64_image_data",
  "documentBackImage": "base64_image_data",
  "selfieImage": "base64_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "verificationId": "uuid",
  "documentVerified": true,
  "faceMatch": true,
  "livenessCheck": true,
  "extractedData": {
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "documentNumber": "AB123456",
    "expiryDate": "2030-12-31",
    "nationality": "Colombian"
  },
  "confidenceScores": {
    "document": 95.5,
    "faceMatch": 98.2,
    "liveness": 96.8
  }
}
```

### GET /api/verification/document/status?id=:verificationId
Check verification status

## User Flow

1. **Registration** (`/host/register`)
   - Create account with email/password
   - Provide basic contact information
   - Accept terms and consent to verification

2. **Email Verification**
   - Automatic email sent with verification link
   - Must verify email before onboarding

3. **Identity Onboarding** (`/host/onboarding`)
   - **Step 1:** Upload government ID
   - **Step 2:** Take selfie for face verification
   - **Step 3:** Upload 5+ GPS-verified property photos
   - **Step 4:** Review and submit

4. **Verification Processing** (24-48 hours)
   - Automated document verification
   - Biometric matching
   - Background check processing
   - Manual admin review if needed

5. **Approval**
   - Email notification
   - Access to host dashboard
   - Can create property listings

6. **Rejection**
   - Email with reason
   - Option to resubmit with corrections
   - Appeal process available

## Verification Status Levels

- `pending` - Initial account creation
- `documents_submitted` - All documents uploaded
- `under_review` - Admin/automated review in progress
- `approved` - Fully verified, can create listings
- `rejected` - Verification failed
- `suspended` - Account suspended due to violations

## Security Best Practices

### Data Encryption

1. **At Rest:**
   - All ID documents encrypted with AES-256
   - Banking information uses envelope encryption
   - Face photos encrypted and stored separately

2. **In Transit:**
   - All API calls over HTTPS/TLS 1.3
   - Certificate pinning on mobile apps

### Data Retention

- ID documents: Retained for legal compliance (7 years)
- Face photos: Deleted after 90 days (post-verification)
- Verification attempts: Retained indefinitely for audit
- GPS coordinates: Retained with property listing

### Privacy Compliance

- **GDPR:** Right to access, rectify, delete personal data
- **CCPA:** California privacy rights compliance
- **Colombian Data Protection Law (Ley 1581):** Local compliance
- Biometric consent explicitly obtained
- Data processing agreements with verification providers

## Third-Party Services Integration

### Recommended Providers

1. **Jumio** (Document Verification)
   - Latin America support
   - Real-time verification
   - Pricing: ~$1-3 per verification
   - Setup: https://www.jumio.com/

2. **Onfido** (Global ID Verification)
   - 195+ countries supported
   - Liveness detection included
   - Pricing: ~$2-5 per verification
   - Setup: https://onfido.com/

3. **Stripe Identity** (Combined Payment + ID)
   - Integrated with Stripe payments
   - Simple API
   - Pricing: $1.50 per verification
   - Setup: https://stripe.com/identity

### Integration Steps

1. Sign up for verification service account
2. Add API keys to `.env.local`:
   ```
   JUMIO_API_KEY=your_api_key
   JUMIO_API_SECRET=your_api_secret
   JUMIO_WEBHOOK_SECRET=your_webhook_secret
   ```
3. Update `/app/api/verification/document/route.ts` with real API calls
4. Configure webhook endpoints for async results
5. Test with sandbox credentials

## Admin Dashboard Features

### Verification Queue
- List of pending verifications
- Document preview
- Approve/reject with notes
- Bulk actions

### Security Monitoring
- Real-time fraud alerts
- Flagged account review
- Verification statistics
- Geographic analytics

### Audit Logs
- All verification attempts
- Admin actions
- Data access logs
- Suspicious activity reports

## Testing

### Development Mode
The system includes mock verification for development:
- Always returns successful verification
- No actual API calls to third-party services
- Simulated 2-second processing delay

### Test Accounts
Create test accounts in development:
```bash
npm run test:create-host
```

### Production Testing
- Use verification service sandbox mode
- Test with valid/invalid documents
- Verify all rejection scenarios
- Load test verification API

## Deployment Checklist

- [ ] Run database migrations: `database/host_verification_schema.sql`
- [ ] Set up verification service account (Jumio/Onfido/Stripe)
- [ ] Add API keys to production environment variables
- [ ] Configure webhook endpoints
- [ ] Set up encryption keys for banking data
- [ ] Enable Supabase Row Level Security policies
- [ ] Test complete registration flow
- [ ] Set up admin notification emails
- [ ] Configure fraud detection rules
- [ ] Enable security monitoring
- [ ] Set up backup procedures for verification data

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure HTTPS (required for getUserMedia)
   - Check browser permissions
   - Verify SSL certificate is valid

2. **GPS not capturing**
   - Location services must be enabled
   - Request permission properly
   - Fallback to manual address entry

3. **Document upload fails**
   - Check file size limits (max 10MB)
   - Verify accepted formats: JPG, PNG, PDF
   - Ensure clear, readable photos

4. **Face verification fails**
   - Good lighting required
   - Remove glasses if possible
   - Look directly at camera
   - Neutral expression

## Support & Maintenance

### Monitoring
- Track verification success/failure rates
- Monitor API response times
- Alert on high rejection rates
- Geographic verification distribution

### Regular Audits
- Review flagged accounts monthly
- Update fraud detection rules
- Compliance checks quarterly
- Security penetration testing annually

## Cost Estimates

### Per Host Verification
- Document verification: $1-5
- Background check: $5-20 (optional, for high-value hosts)
- Storage (per host): ~$0.10/month
- **Total:** ~$6-25 per new host

### Monthly Operational Costs (1000 hosts)
- Verification services: $1,000-5,000
- Storage: $100
- Bandwidth: $50
- **Total:** ~$1,150-5,150/month

## Future Enhancements

- [ ] AI-powered fraud detection
- [ ] Video verification calls
- [ ] Blockchain-based identity verification
- [ ] Decentralized identity (DID) support
- [ ] Enhanced property verification (drone photos, 360° tours)
- [ ] Host insurance verification
- [ ] Professional hosting certificates
- [ ] Reputation score from verification data

## Contact & Support

For technical support or questions about the verification system:
- Email: support@sptcrural.com
- Documentation: https://docs.sptcrural.com/host-verification
- API Status: https://status.sptcrural.com
