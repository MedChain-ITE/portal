<script setup>
useSeoMeta({
  title: 'MedChain | Secure Medical Records',
  description: 'Patient-controlled, secure medical records powered by blockchain technology for hospitals and clinics.'
})

definePageMeta({ layout: 'default' })

import { ArrowRight } from '@element-plus/icons-vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">

    <!-- Navbar -->
    <NavBar />

    <!-- HERO -->
    <section class="bg-white py-20 border-b">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
          Secure Medical Records
        </h1>
        <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Patient-controlled, encrypted healthcare data accessible by hospitals and providers with full privacy and compliance.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <el-button type="primary" size="large" class="px-8 py-5">
            Access Patient Portal
            <el-icon class="ml-2"><ArrowRight /></el-icon>
          </el-button>

          <el-button size="large" class="px-8 py-5">
            Request Hospital Demo
          </el-button>
        </div>

        <!-- Trust badges -->
        <div class="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>HIPAA Compliant</span>
          <span>GDPR Ready</span>
          <span>End-to-End Encryption</span>
          <span>ISO 27001 Certified</span>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="py-12 bg-gray-100">
      <div class="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold text-blue-600">10M+</div>
          <p class="text-sm text-gray-600">Patient Records Protected</p>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600">150+</div>
          <p class="text-sm text-gray-600">Hospitals Integrated</p>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600">2s</div>
          <p class="text-sm text-gray-600">Average Access Time</p>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600">100%</div>
          <p class="text-sm text-gray-600">Compliance Ready</p>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold">Why Hospitals Choose MedChain</h2>
          <p class="text-gray-600 mt-2">Designed for clinical workflows and patient privacy</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="p-6 border rounded-xl">
            <h3 class="font-semibold mb-2">Secure Data Storage</h3>
            <p class="text-gray-600 text-sm">All records are encrypted and safely stored with blockchain verification.</p>
          </div>

          <div class="p-6 border rounded-xl">
            <h3 class="font-semibold mb-2">Patient Control</h3>
            <p class="text-gray-600 text-sm">Patients manage who can access their medical records at any time.</p>
          </div>

          <div class="p-6 border rounded-xl">
            <h3 class="font-semibold mb-2">Instant Access</h3>
            <p class="text-gray-600 text-sm">Doctors can securely retrieve records in seconds with patient approval.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- WORKFLOW -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold">How Patient Data is Secured</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-blue-600 text-2xl font-bold mb-2">1</div>
            <h3 class="font-semibold">Create Patient Profile</h3>
            <p class="text-gray-600 text-sm">Patients register securely with identity verification.</p>
          </div>

          <div>
            <div class="text-blue-600 text-2xl font-bold mb-2">2</div>
            <h3 class="font-semibold">Secure Medical Record</h3>
            <p class="text-gray-600 text-sm">Medical data is encrypted and stored securely.</p>
          </div>

          <div>
            <div class="text-blue-600 text-2xl font-bold mb-2">3</div>
            <h3 class="font-semibold">Doctor Access Approval</h3>
            <p class="text-gray-600 text-sm">Patients approve access for healthcare providers.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-blue-600 text-white text-center">
      <h2 class="text-3xl font-bold mb-4">Modernize Your Hospital System</h2>
      <p class="mb-6">Secure, compliant, and patient-centered medical records.</p>

      <el-button type="primary" size="large" class="bg-white text-blue-600 px-8 py-5">
        Request Demo
      </el-button>
    </section>

    <!-- FOOTER -->
    <footer class="bg-gray-900 text-gray-400 py-10 text-center">
      <p>© 2026 MedChain. All rights reserved.</p>
    </footer>

  </div>
</template>

<style scoped>
body {
  font-family: Inter, sans-serif;
}
</style>
