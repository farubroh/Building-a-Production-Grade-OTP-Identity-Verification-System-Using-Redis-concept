<h1>Production-Grade OTP & Identity Verification System</h1></br>


<div>
   Recently, I built a secure OTP system for registration & password reset, and then extended it into a reusable identity verification service.
</div>

<div>
  <b>
     Tech Stack: Spring Boot 
  </b> 
   <ul>
      <li> Redis</li>
      <li> Email & SMS OTP</li>
   </ul>

What I implemented & learned:

 ✓ OTP for Email & Mobile (Redis + TTL)

 ✓ Multiple purposes: Registration, Password Reset, Login 2FA

 ✓ OTP hashing (no plain OTP stored)

 ✓ Attempt tracking & temporary blocking

 ✓ Resend & rate-limiting logic

 ✓ Token-based, stateless verification

 ✓ Audit logs for traceability

High-level flow:

 Request OTP → Store hashed OTP in Redis (TTL) → Send via Email/SMS → Verify → Clean up



One of the most exciting parts was integrating real SMS delivery to mobile numbers, handling retries, rate limits, and failure scenarios — it made the system feel truly production-ready.
</div>



