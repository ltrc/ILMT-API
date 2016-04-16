#!/usr/bin/env perl
use Dir::Self;
use strict;
use warnings;
use Data::Dumper;
use Mojolicious::Lite;
use lib __DIR__ . "/lib";
use ILMT::Translator qw(get_translator get_langpairs);
use ILMT::HIN::PAN;
use ILMT::PAN::HIN;

plugin qw(Mojolicious::Plugin::ForkCall);

any '/:src/:tgt/translate' => sub {
    my $c = shift->render_later;
    $c->inactivity_timeout(3600);
    my %args = %{$c->req->params->to_hash};
    $args{'src_lang'} = $c->param('src');
    $args{'tgt_lang'} = $c->param('tgt');
    $args{'data'} = $args{'input'} = $args{'data'} // $args{'input'};
    $c->fork_call(
        sub {
            my (%args) = @_;
            my $translator = get_translator(uc($c->param('src')), uc($c->param('tgt')));
            return $translator->translate(%args);
        },
        [%args],
        sub {
            my ($c, $final_result) = @_;
            if (exists $args{"pretty"}) {
                my $final_string = join "\n", map { "$_:\n$final_result->{$_}" } keys %$final_result;
                $c->render(template => 'pretty', result => $final_string);
            } else {
                $c->render(json => $final_result);
            }
        }
    );
};

any '/:src/:tgt/:start/:end' => sub {
    my $c = shift->render_later;
    $c->inactivity_timeout(3600);
    my %args = %{$c->req->params->to_hash};
    $args{'src_lang'} = $c->param('src');
    $args{'tgt_lang'} = $c->param('tgt');
    $args{'data'} = $args{'input'} = $args{'data'} // $args{'input'};
    $c->fork_call(
        sub {
            my (%args) = @_;
            my $translator = get_translator(uc($c->param('src')), uc($c->param('tgt')));
            return $translator->partial_p($c->param('start'), $c->param('end'), %args);
        },
        [%args],
        sub {
            my ($c, $final_result) = @_;
            if (exists $args{"pretty"}) {
                my $final_string = join "\n", map { "$_:\n$final_result->{$_}" } keys %$final_result;
                $c->render(template => 'pretty', result => $final_string);
            } else {
                $c->render(json => $final_result);
            }
        }
    );
};

any '/:src/:tgt/' => sub {
    my $c = shift;
    my $translator = get_translator(uc($c->param('src')), uc($c->param('tgt')));
    $c->render(text => scalar @{$translator->{seq}});
};

any '/:src/:tgt/modules' => sub {
    my $c = shift;
    my $translator = get_translator(uc($c->param('src')), uc($c->param('tgt')));
    my @modules = map { lc($_) } @{$translator->{seq}};
    $c->render(json => \@modules);
};

any '/langpairs' => sub {
    my $c = shift;
    my %langpairs = get_langpairs();
    $c->render(json => \%langpairs);
};

app->start;
__DATA__

@@ pretty.html.ep
<pre><%= $result %></pre>
