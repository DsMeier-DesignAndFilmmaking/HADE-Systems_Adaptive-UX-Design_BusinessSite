// CaptureContextFieldNotes.swift
// HADE Systems — Adaptive UX Design
// ChatGPT-style signal capture sheet — v2.0

import SwiftUI

// MARK: - Data Model

struct SignalMessage: Identifiable, Equatable {
    let id: UUID
    let text: String
    let isUser: Bool
    let timestamp: Date

    init(text: String, isUser: Bool) {
        self.id        = UUID()
        self.text      = text
        self.isUser    = isUser
        self.timestamp = Date()
    }
}

// MARK: - HADE Response Engine (mock)

private enum HADEResponseEngine {
    static func respond(to input: String) -> String {
        let lower = input.lowercased()

        if lower.contains("crowded") || lower.contains("busy") || lower.contains("packed") {
            return "Noted — high-density signal absorbed. HADE will prioritise quieter windows: early morning openings, lull periods mid-afternoon, or secondary venues with lower footfall nearby. Recalibrating discovery stack."
        }

        if lower.contains("expensive") || lower.contains("pricey") || lower.contains("cost") || lower.contains("cheap") || lower.contains("budget") {
            return "Value signal captured. Adjusting discovery filters toward locally-owned venues, neighbourhood fixtures, and off-peak pricing tiers. Context is live in the engine."
        }

        if lower.contains("quiet") || lower.contains("calm") || lower.contains("peaceful") || lower.contains("low-key") {
            return "Ambient preference logged — low-energy, contemplative environments weighted higher. HADE is surfacing venues with acoustic dampening, natural light, and unhurried service cadence."
        }

        if lower.contains("food") || lower.contains("eat") || lower.contains("hungry") || lower.contains("lunch") || lower.contains("dinner") {
            return "Culinary context locked in. Discovery stack recalibrating around neighbourhood dining — local menus, kitchen hours, and proximity clusters factored into the signal map."
        }

        if lower.contains("park") || lower.contains("outdoor") || lower.contains("outside") || lower.contains("open air") {
            return "Outdoor context absorbed. HADE is mapping open-air venues, rooftop access, terrace clusters, and green-adjacent spaces near your current signal coordinates."
        }

        if lower.contains("music") || lower.contains("live") || lower.contains("dj") || lower.contains("sound") || lower.contains("acoustic") {
            return "Sonic signal captured. Filtering toward venues with live programming, curated listening environments, and acoustic-forward interiors. Sense map updated."
        }

        // Generic fallback
        return "Context absorbed — signal injected into the discovery stack. HADE is recalibrating the sense map around your field note. Relevant venues will surface as the engine processes."
    }
}

// MARK: - Chat Bubble

struct ChatMessageBubble: View {
    let message: SignalMessage

    // Design tokens
    private let userBg     = Color(red: 0.173, green: 0.173, blue: 0.118) // #2C2C1E charcoal-warm
    private let systemBg   = Color(red: 0.961, green: 0.953, blue: 0.929) // #F5F2ED cream
    private let userText   = Color.white
    private let systemText = Color(red: 0.173, green: 0.173, blue: 0.118)
    private let systemMeta = Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.38)

    var body: some View {
        HStack(alignment: .bottom, spacing: 0) {
            if message.isUser { Spacer(minLength: 52) }

            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 4) {
                if !message.isUser {
                    Text("HADE")
                        .font(.system(size: 9, weight: .black))
                        .tracking(2.2)
                        .foregroundColor(systemMeta)
                        .padding(.horizontal, 4)
                }

                Text(message.text)
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(message.isUser ? userText : systemText)
                    .lineSpacing(3)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(
                        message.isUser
                            ? AnyView(
                                RoundedRectangle(cornerRadius: 20, style: .continuous)
                                    .fill(userBg)
                            )
                            : AnyView(
                                RoundedRectangle(cornerRadius: 20, style: .continuous)
                                    .fill(systemBg)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 20, style: .continuous)
                                            .stroke(Color(red: 0.91, green: 0.89, blue: 0.86), lineWidth: 1)
                                    )
                            )
                    )
            }

            if !message.isUser { Spacer(minLength: 52) }
        }
        .transition(
            .asymmetric(
                insertion: .move(edge: message.isUser ? .trailing : .leading)
                    .combined(with: .opacity),
                removal: .opacity
            )
        )
    }
}

// MARK: - Thinking Indicator

struct HADEThinkingBubble: View {
    @State private var phase: Int = 0
    private let cream = Color(red: 0.961, green: 0.953, blue: 0.929)
    private let dot   = Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.30)

    var body: some View {
        HStack(alignment: .bottom, spacing: 0) {
            VStack(alignment: .leading, spacing: 4) {
                Text("HADE")
                    .font(.system(size: 9, weight: .black))
                    .tracking(2.2)
                    .foregroundColor(Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.38))
                    .padding(.horizontal, 4)

                HStack(spacing: 5) {
                    ForEach(0..<3, id: \.self) { index in
                        Circle()
                            .fill(dot)
                            .frame(width: 7, height: 7)
                            .scaleEffect(phase == index ? 1.35 : 1.0)
                            .animation(
                                .easeInOut(duration: 0.38)
                                    .repeatForever()
                                    .delay(Double(index) * 0.14),
                                value: phase
                            )
                    }
                }
                .padding(.horizontal, 18)
                .padding(.vertical, 14)
                .background(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .fill(cream)
                        .overlay(
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .stroke(Color(red: 0.91, green: 0.89, blue: 0.86), lineWidth: 1)
                        )
                )
            }

            Spacer(minLength: 52)
        }
        .onAppear {
            withAnimation { phase = 1 }
        }
        .transition(.opacity.combined(with: .move(edge: .leading)))
    }
}

// MARK: - Input Bar

struct SignalInputBar: View {
    @Binding var text: String
    @FocusState.Binding var isFocused: Bool
    let onSend:         () -> Void
    let onMic:          () -> Void
    let onCamera:       () -> Void
    let isThinking:     Bool

    private let inkFaint  = Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.06)
    private let inkMid    = Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.28)
    private let inkStrong = Color(red: 0.173, green: 0.173, blue: 0.118)
    private let warmLine  = Color(red: 0.910, green: 0.894, blue: 0.863)

    private var canSend: Bool { !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isThinking }

    var body: some View {
        HStack(alignment: .bottom, spacing: 10) {

            // Secondary actions — mic + camera
            HStack(spacing: 2) {
                Button(action: onMic) {
                    Image(systemName: "mic")
                        .font(.system(size: 17, weight: .light))
                        .foregroundColor(inkMid)
                        .frame(width: 36, height: 36)
                        .contentShape(Rectangle())
                }
                .disabled(isThinking)

                Button(action: onCamera) {
                    Image(systemName: "camera")
                        .font(.system(size: 17, weight: .light))
                        .foregroundColor(inkMid)
                        .frame(width: 36, height: 36)
                        .contentShape(Rectangle())
                }
                .disabled(isThinking)
            }

            // Text field
            TextField("Describe the vibe, context, or signal...", text: $text, axis: .vertical)
                .font(.system(size: 15))
                .foregroundColor(inkStrong)
                .lineLimit(1...5)
                .focused($isFocused)
                .submitLabel(.send)
                .onSubmit {
                    if canSend { onSend() }
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(
                    RoundedRectangle(cornerRadius: 22, style: .continuous)
                        .fill(inkFaint)
                        .overlay(
                            RoundedRectangle(cornerRadius: 22, style: .continuous)
                                .stroke(warmLine, lineWidth: 1)
                        )
                )

            // Send button — appears only when text exists
            if canSend {
                Button(action: onSend) {
                    Image(systemName: "arrow.up")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(width: 36, height: 36)
                        .background(
                            Circle()
                                .fill(inkStrong)
                        )
                }
                .transition(.scale(scale: 0.7).combined(with: .opacity))
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(
            Color(red: 0.996, green: 0.988, blue: 0.973) // #FEFCF8 warmWhite
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(warmLine),
                    alignment: .top
                )
        )
    }
}

// MARK: - Main Sheet View

struct CaptureContextFieldNotes: View {

    // Presentation binding
    @Binding var isPresented: Bool

    // Message state
    @State private var messages: [SignalMessage] = []
    @State private var inputText: String         = ""
    @State private var isThinking: Bool          = false
    @FocusState private var inputFocused: Bool

    // Scroll proxy anchor
    private let bottomAnchor = "BOTTOM_ANCHOR"

    // Design tokens
    private let bg         = Color(red: 0.996, green: 0.988, blue: 0.973) // #FEFCF8
    private let inkStrong  = Color(red: 0.173, green: 0.173, blue: 0.118)
    private let inkFaint   = Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.22)
    private let warmLine   = Color(red: 0.910, green: 0.894, blue: 0.863)

    // MARK: Body

    var body: some View {
        VStack(spacing: 0) {

            // ── Header ───────────────────────────────────────────────────
            header

            Divider().background(warmLine)

            // ── Message List ─────────────────────────────────────────────
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 16) {

                        if messages.isEmpty {
                            emptyState
                                .padding(.top, 40)
                        }

                        ForEach(messages) { message in
                            ChatMessageBubble(message: message)
                                .padding(.horizontal, 16)
                        }

                        if isThinking {
                            HADEThinkingBubble()
                                .padding(.horizontal, 16)
                        }

                        // Invisible scroll target
                        Color.clear
                            .frame(height: 1)
                            .id(bottomAnchor)
                    }
                    .padding(.vertical, 20)
                    .animation(.spring(response: 0.38, dampingFraction: 0.82), value: messages)
                    .animation(.easeInOut(duration: 0.22), value: isThinking)
                }
                .background(bg)
                .onChange(of: messages.count) { _ in
                    withAnimation(.easeOut(duration: 0.28)) {
                        proxy.scrollTo(bottomAnchor, anchor: .bottom)
                    }
                }
                .onChange(of: isThinking) { thinking in
                    if thinking {
                        withAnimation(.easeOut(duration: 0.28)) {
                            proxy.scrollTo(bottomAnchor, anchor: .bottom)
                        }
                    }
                }
            }

            // ── Input Bar ────────────────────────────────────────────────
            SignalInputBar(
                text: $inputText,
                isFocused: $inputFocused,
                onSend:   handleSend,
                onMic:    handleMic,
                onCamera: handleCamera,
                isThinking: isThinking
            )
        }
        .background(bg)
        .onAppear {
            // Auto-focus text field when sheet opens
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                inputFocused = true
            }
        }
    }

    // MARK: Header

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 3) {
                Text("Field Notes")
                    .font(.system(size: 18, weight: .semibold, design: .serif))
                    .foregroundColor(inkStrong)

                Text("CAPTURE CONTEXT")
                    .font(.system(size: 9, weight: .black))
                    .tracking(2.4)
                    .foregroundColor(inkFaint)
            }

            Spacer()

            Button {
                inputFocused = false
                isPresented  = false
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(inkStrong.opacity(0.45))
                    .frame(width: 36, height: 36)
                    .background(
                        Circle()
                            .fill(Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.06))
                    )
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
    }

    // MARK: Empty State

    private var emptyState: some View {
        VStack(spacing: 16) {
            Text("What's the signal?")
                .font(.system(size: 20, weight: .semibold, design: .serif))
                .foregroundColor(inkStrong)

            Text("Describe what you're sensing — a vibe, context, constraint, or discovery intent. HADE will absorb it and recalibrate.")
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(inkStrong.opacity(0.45))
                .multilineTextAlignment(.center)
                .lineSpacing(4)
                .padding(.horizontal, 32)

            // Prompt chips
            VStack(spacing: 8) {
                ForEach(promptChips, id: \.self) { chip in
                    Button {
                        inputText = chip
                        inputFocused = true
                    } label: {
                        Text(chip)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(inkStrong.opacity(0.55))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 9)
                            .background(
                                Capsule()
                                    .fill(Color(red: 0.173, green: 0.173, blue: 0.118).opacity(0.05))
                                    .overlay(
                                        Capsule()
                                            .stroke(warmLine, lineWidth: 1)
                                    )
                            )
                    }
                }
            }
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity)
        .transition(.opacity)
    }

    private let promptChips: [String] = [
        "It feels crowded and touristy here",
        "Looking for something calm and low-key",
        "Budget is tight today",
        "High energy — outdoor vibe preferred",
    ]

    // MARK: Actions

    private func handleSend() {
        let trimmed = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        // Append user message
        withAnimation {
            messages.append(SignalMessage(text: trimmed, isUser: true))
        }
        inputText = ""

        // Show thinking indicator, then respond after delay
        isThinking = true
        let responseText = HADEResponseEngine.respond(to: trimmed)

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            withAnimation {
                isThinking = false
                messages.append(SignalMessage(text: responseText, isUser: false))
            }
        }
    }

    private func handleMic() {
        // Voice input — pre-fill placeholder to guide user
        inputText    = ""
        inputFocused = true
        // In production: begin AVAudioSession capture and stream transcription into inputText
    }

    private func handleCamera() {
        // Photo input — in production: present PHPickerViewController and run vision analysis
        inputFocused = false
        // Placeholder: inject a contextual signal describing a captured scene
        withAnimation {
            messages.append(SignalMessage(
                text: "📷  Brutalist concrete facade — raw texture, diffused natural light, off the main strip.",
                isUser: true
            ))
        }
        isThinking = true
        let response = HADEResponseEngine.respond(to: "brutalist architecture concrete hidden interior space")
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) {
            withAnimation {
                isThinking = false
                messages.append(SignalMessage(text: response, isUser: false))
            }
        }
    }
}

// MARK: - Preview

#Preview {
    Color(red: 0.910, green: 0.894, blue: 0.863)
        .ignoresSafeArea()
        .sheet(isPresented: .constant(true)) {
            CaptureContextFieldNotes(isPresented: .constant(true))
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
                .presentationCornerRadius(28)
        }
}
